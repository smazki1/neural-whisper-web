import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-icount-secret',
};

const ICOUNT_SECRET = '882F87C04676B449'; // Your unique iCount secret

interface ICountWebhookData {
  doctype: string;
  docnum: string;
  timeissued: string;
  clientname: string;
  totalwithvat: string;
  totalsum: string;
  totalvat: string;
  client_id: string;
  client: {
    email: string;
    phone?: string;
    mobile?: string;
  };
  custom_field?: string; // This should contain our order ID
  items: Array<{
    description: string;
    unitprice: string;
    quantity: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify iCount webhook security header
    const icountSecret = req.headers.get('X-iCount-Secret');
    if (icountSecret !== ICOUNT_SECRET) {
      console.error('Invalid iCount secret header:', icountSecret);
      return new Response('Unauthorized', { status: 401 });
    }

    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Parse webhook data
    const webhookData: ICountWebhookData[] = await req.json();
    console.log('iCount webhook received:', JSON.stringify(webhookData, null, 2));

    // Process each document in the webhook
    for (const doc of webhookData) {
      // Only process invoice/receipt documents
      if (doc.doctype !== 'invrec') {
        console.log('Skipping non-invoice document:', doc.doctype);
        continue;
      }

      try {
        // Find the order using custom_field or by matching client info and amount
        let order = null;
        
        if (doc.custom_field) {
          // Try to find order by ID stored in custom_field
          const { data: orderData } = await supabaseService
            .from('orders')
            .select('*, products(*)')
            .eq('id', doc.custom_field)
            .single();
          order = orderData;
        }

        if (!order) {
          // Fallback: try to match by amount and find pending order
          const { data: orderData } = await supabaseService
            .from('orders')
            .select('*, products(*)')
            .eq('total_amount', parseFloat(doc.totalwithvat))
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          order = orderData;
        }

        if (!order) {
          console.error('No matching order found for iCount document:', doc.docnum);
          continue;
        }

        // Update order status to completed
        const { error: updateError } = await supabaseService
          .from('orders')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);

        if (updateError) {
          console.error('Failed to update order:', updateError);
          continue;
        }

        // Create payment record
        const { error: paymentError } = await supabaseService
          .from('payments')
          .insert({
            order_id: order.id,
            amount: parseFloat(doc.totalwithvat),
            currency: 'ILS',
            payment_method: 'icount',
            transaction_id: doc.docnum,
            status: 'completed',
            processed_at: new Date().toISOString()
          });

        if (paymentError) {
          console.error('Failed to create payment record:', paymentError);
        }

        // If this is a course purchase, grant access
        if (order.products && order.user_id) {
          // Find if this product has an associated course
          const { data: course } = await supabaseService
            .from('courses')
            .select('id')
            .eq('title', order.products.title)
            .single();

          if (course) {
            // Create user progress entry to grant access
            await supabaseService
              .from('user_progress')
              .upsert({
                user_id: order.user_id,
                course_id: course.id,
                progress_percentage: 0
              });
          }
        }

        console.log('Successfully processed iCount payment:', {
          orderId: order.id,
          icountDocnum: doc.docnum,
          amount: doc.totalwithvat,
          clientEmail: doc.client.email
        });

      } catch (docError) {
        console.error('Error processing document:', doc.docnum, docError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: webhookData.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: unknown) {
    console.error('Error processing iCount webhook:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});