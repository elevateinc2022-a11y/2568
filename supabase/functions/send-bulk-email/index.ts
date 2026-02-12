import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";
import { Resend } from "npm:resend";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Ensure the Resend API key is available.
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set in environment variables.");
    return new Response(
      JSON.stringify({ error: "Server configuration error: Missing API key." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the user from the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized: Missing Authorization header", {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userAuth, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !userAuth.user) {
      console.error("Authentication error:", authError);
      return new Response("Unauthorized: Invalid authentication token", {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");

    if (!ADMIN_EMAIL || userAuth.user.email !== ADMIN_EMAIL) {
      console.warn("Unauthorized attempt to send bulk email by:", userAuth.user.email);
      return new Response("Unauthorized: Only the admin user can send bulk emails.", {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if the authenticated user is an admin (e.g., by checking their email or a custom claim)
    // For this example, we'll assume any authenticated user can send newsletters.
    // In a real application, you'd add more robust role-based access control.

    const { subject, htmlContent } = await req.json();

    if (!subject || !htmlContent) {
      return new Response(JSON.stringify({ error: "Subject and HTML content are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all newsletter subscribers
    const { data: subscribers, error: fetchError } = await supabaseClient
      .from('newsletter_subscribers')
      .select('email');

    if (fetchError) {
      console.error("Error fetching subscribers for bulk email:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch subscribers for bulk email." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: "No subscribers found to send email to." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(RESEND_API_KEY);
    const recipientEmails = subscribers.map(s => s.email);

    // Send the bulk email
    const { data, error } = await resend.emails.send({
      from: "OERC Newsletter <info@oerc.ca>", // Consistent sender
      to: recipientEmails,
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error("Error sending bulk email via Resend:", error);
      return new Response(JSON.stringify({ error: "Failed to send bulk email." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Bulk email sent successfully", data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});