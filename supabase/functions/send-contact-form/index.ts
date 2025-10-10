import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  webhookUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    
    console.log("Received contact form submission:", {
      fullName: formData.fullName,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      hasMessage: !!formData.message,
      hasWebhook: !!formData.webhookUrl
    });

    // Validate required fields
    if (!formData.fullName || !formData.company || !formData.email || !formData.phone) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "חסרים שדות חובה" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate webhook URL if provided
    if (!formData.webhookUrl) {
      console.error("Missing webhook URL");
      return new Response(
        JSON.stringify({ error: "חסר כתובת Webhook" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Prepare data for webhook
    const webhookPayload = {
      fullName: formData.fullName,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || "",
      timestamp: new Date().toISOString(),
      source: "corporate-workshops-form"
    };

    console.log("Sending data to webhook:", formData.webhookUrl);

    // Send to webhook
    const webhookResponse = await fetch(formData.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      console.error("Webhook failed:", webhookResponse.status, webhookResponse.statusText);
      return new Response(
        JSON.stringify({ 
          error: "שליחת הטופס נכשלה",
          details: `Webhook returned status ${webhookResponse.status}`
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Webhook sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "הטופס נשלח בהצלחה"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-form function:", error);
    return new Response(
      JSON.stringify({ 
        error: "שגיאה בשליחת הטופס",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
