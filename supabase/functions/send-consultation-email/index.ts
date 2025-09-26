import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsultationEmailRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  businessType: string;
  currentChallenge: string;
  timeline?: string;
  budget?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      phone, 
      company, 
      businessType, 
      currentChallenge,
      timeline,
      budget,
      message 
    }: ConsultationEmailRequest = await req.json();

    // Send confirmation email to the client
    const clientEmailResponse = await resend.emails.send({
      from: "אבי פריד - AI Master <noreply@ai-master.co.il>",
      to: [email],
      subject: "תודה על פנייתך לייעוץ בבינה מלאכותית 🚀",
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background: linear-gradient(135deg, #eec643, #f0e68c); padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <h1 style="color: #101933; margin: 0; font-size: 28px; font-weight: bold;">שלום ${name}! 👋</h1>
            <p style="color: #162347; margin: 10px 0 0 0; font-size: 18px;">תודה על פנייתך לייעוץ בבינה מלאכותית</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #101933; margin-top: 0;">מה קורה עכשיו?</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #eec643;">
              <h3 style="color: #101933; margin-top: 0;">השלבים הבאים:</h3>
              <ul style="color: #162347; padding-right: 20px;">
                <li style="margin: 10px 0;">📞 <strong>תוך 24 שעות</strong> - אחזור אליך לתיאום שיחת היכרות ראשונית (חינם)</li>
                <li style="margin: 10px 0;">🎯 <strong>שיחת היכרות</strong> - נדבר על הצרכים והמטרות שלך (30 דקות)</li>
                <li style="margin: 10px 0;">📋 <strong>הצעה מותאמת</strong> - אכין עבורך תוכנית עבודה מדויקת</li>
                <li style="margin: 10px 0;">🚀 <strong>התחלת התהליך</strong> - נתחיל לבנות את העתיד הדיגיטלי שלך</li>
              </ul>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #101933; margin-top: 0;">הפרטים שלך:</h3>
              <p style="color: #162347; margin: 5px 0;"><strong>שם:</strong> ${name}</p>
              <p style="color: #162347; margin: 5px 0;"><strong>אימייל:</strong> ${email}</p>
              ${phone ? `<p style="color: #162347; margin: 5px 0;"><strong>טלפון:</strong> ${phone}</p>` : ''}
              ${company ? `<p style="color: #162347; margin: 5px 0;"><strong>חברה:</strong> ${company}</p>` : ''}
              <p style="color: #162347; margin: 5px 0;"><strong>סוג עסק:</strong> ${businessType}</p>
              <p style="color: #162347; margin: 5px 0;"><strong>האתגר העיקרי:</strong> ${currentChallenge}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #162347; font-size: 16px;">יש לך שאלות? אני כאן בשבילך!</p>
              <div style="margin: 15px 0;">
                <a href="mailto:avi@ai-master.co.il" style="color: #213670; text-decoration: none; margin: 0 15px;">📧 avi@ai-master.co.il</a>
                <a href="tel:+972501234567" style="color: #213670; text-decoration: none; margin: 0 15px;">📞 050-123-4567</a>
              </div>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="color: #162347; margin: 0; font-style: italic;">
                "הבינה המלאכותית היא לא עתיד רחוק - היא כאן עכשיו, והיא יכולה לשנות את העסק שלך כבר היום"
              </p>
              <p style="color: #101933; margin: 10px 0 0 0; font-weight: bold;">- אבי פריד</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            <p>AI Master | המומחים בבינה מלאכותית לעסקים</p>
            <p>© 2024 כל הזכויות שמורות</p>
          </div>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "AI Master System <noreply@ai-master.co.il>",
      to: ["avi@ai-master.co.il"], // Replace with actual admin email
      subject: `🎯 פנייה חדשה לייעוץ מ-${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #101933, #213670); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎯 פנייה חדשה לייעוץ</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">מישהו מעוניין בייעוץ AI!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #101933; margin-top: 0;">פרטי הלקוח:</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #101933;">שם:</td><td style="padding: 8px 0; color: #162347;">${name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #101933;">אימייל:</td><td style="padding: 8px 0; color: #162347;"><a href="mailto:${email}" style="color: #213670;">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #101933;">טלפון:</td><td style="padding: 8px 0; color: #162347;"><a href="tel:${phone}" style="color: #213670;">${phone}</a></td></tr>` : ''}
                ${company ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #101933;">חברה/עסק:</td><td style="padding: 8px 0; color: #162347;">${company}</td></tr>` : ''}
                <tr><td style="padding: 8px 0; font-weight: bold; color: #101933;">סוג עסק:</td><td style="padding: 8px 0; color: #162347;">${businessType}</td></tr>
                ${timeline ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #101933;">לוח זמנים:</td><td style="padding: 8px 0; color: #162347;">${timeline}</td></tr>` : ''}
                ${budget ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #101933;">תקציב:</td><td style="padding: 8px 0; color: #162347;">${budget}</td></tr>` : ''}
              </table>
            </div>

            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-right: 4px solid #eec643;">
              <h3 style="color: #101933; margin-top: 0;">האתגר העיקרי:</h3>
              <p style="color: #162347; font-style: italic;">"${currentChallenge}"</p>
            </div>

            ${message ? `
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #101933; margin-top: 0;">הודעה נוספת:</h3>
              <p style="color: #162347; white-space: pre-wrap;">${message}</p>
            </div>
            ` : ''}

            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <p style="color: #101933; font-size: 18px; font-weight: bold; margin: 0;">💡 זכור לחזור ללקוח תוך 24 שעות!</p>
              <p style="color: #162347; margin: 10px 0 0 0;">הראשונות לתגובה מקבלות את הלקוחות הטובים ביותר</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Consultation emails sent successfully:", { clientEmailResponse, adminEmailResponse });

    return new Response(JSON.stringify({ 
      success: true,
      clientEmailId: clientEmailResponse.data?.id,
      adminEmailId: adminEmailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-consultation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);