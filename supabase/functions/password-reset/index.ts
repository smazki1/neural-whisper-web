import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

interface PasswordResetRequest {
  email: string;
  action: 'request' | 'confirm';
  token?: string;
  password?: string;
}

const generateSecureToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, action, token, password }: PasswordResetRequest = await req.json();

    if (action === 'request') {
      // Rate limiting check - max 3 requests per hour per email
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const { data: recentRequests } = await supabase
        .from('password_resets')
        .select('id')
        .eq('email', email)
        .gte('created_at', oneHourAgo.toISOString());

      if (recentRequests && recentRequests.length >= 3) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait before requesting another reset." }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Check if user exists
      const { data: user } = await supabase.auth.admin.getUserByEmail(email);
      
      if (!user.user) {
        // Return success for security (don't reveal if email exists)
        return new Response(
          JSON.stringify({ success: true, message: "If the email exists, a reset link has been sent." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Generate secure token
      const resetToken = generateSecureToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token
      await supabase.from('password_resets').insert({
        user_id: user.user.id,
        email: email,
        token: resetToken,
        expires_at: expiresAt.toISOString()
      });

      // Send email
      const resetUrl = `${req.headers.get('origin') || 'https://ai-master.co.il'}/reset-password/${resetToken}`;
      
      await resend.emails.send({
        from: "AI Master <noreply@resend.dev>",
        to: [email],
        subject: "Reset Your AI Master Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>Hi there,</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            <p>This link expires in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>The AI Master Team</p>
          </div>
        `,
      });

      return new Response(
        JSON.stringify({ success: true, message: "Reset link sent to your email" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );

    } else if (action === 'confirm') {
      if (!token || !password) {
        return new Response(
          JSON.stringify({ error: "Token and password are required" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Validate token
      const { data: resetRecord } = await supabase
        .from('password_resets')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .single();

      if (!resetRecord) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired reset token" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Check expiration
      if (new Date() > new Date(resetRecord.expires_at)) {
        return new Response(
          JSON.stringify({ error: "Reset token has expired" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        resetRecord.user_id,
        { password }
      );

      if (updateError) {
        console.error("Password update error:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update password" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Mark token as used
      await supabase
        .from('password_resets')
        .update({ used: true })
        .eq('token', token);

      return new Response(
        JSON.stringify({ success: true, message: "Password updated successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Password reset error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);