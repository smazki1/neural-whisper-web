import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreatePaymentRequest {
  productId: string;
  userId?: string;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get authenticated user (optional for guest checkouts)
    let user = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    const { productId, userId, customerInfo }: CreatePaymentRequest = await req.json();

    // Get product details
    const { data: product, error: productError } = await supabaseService
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_published', true)
      .single();

    if (productError || !product) {
      throw new Error('Product not found or not published');
    }

    // Create order in database
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert({
        user_id: user?.id || userId,
        product_id: productId,
        total_amount: product.price,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      throw new Error('Failed to create order');
    }

    // Create iCount payment page
    const icountApiToken = Deno.env.get('ICOUNT_API_TOKEN');
    if (!icountApiToken) {
      throw new Error('iCount API token not configured');
    }

    // Validate that product has icount_paypage_id configured
    if (!product.icount_paypage_id) {
      throw new Error('Product does not have iCount paypage ID configured');
    }

    const icountData = new URLSearchParams({
      'paypage_id': product.icount_paypage_id,
      'currency_id': '5', // ILS
      'items[0][unitprice_incl]': product.price.toString(),
      'items[0][description]': product.title,
      'ttl': '24h', // 24 hours expiry
      'success_url': `${req.headers.get('origin')}/payment-success?order_id=${order.id}`,
      'cancel_url': `${req.headers.get('origin')}/payment-canceled?order_id=${order.id}`,
      'custom_field': order.id // Store order ID for webhook processing
    });

    const icountResponse = await fetch('https://api.icount.co.il/api/v3.php/paypage/generate_sale', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${icountApiToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: icountData.toString()
    });

    if (!icountResponse.ok) {
      const errorText = await icountResponse.text();
      console.error('iCount API error:', errorText);
      throw new Error('Failed to create payment page');
    }

    const icountResult = await icountResponse.json();
    
    // Update order with iCount payment info
    if (icountResult.payment_url) {
      await supabaseService
        .from('orders')
        .update({ 
          stripe_session_id: icountResult.payment_id || icountResult.reference_id // Store iCount reference
        })
        .eq('id', order.id);
    }

    console.log('iCount payment created:', {
      orderId: order.id,
      productTitle: product.title,
      amount: product.price,
      paymentUrl: icountResult.payment_url
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        payment_url: icountResult.payment_url,
        order_id: order.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: unknown) {
    console.error('Error creating iCount payment:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});