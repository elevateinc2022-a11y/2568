import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// The default CORS headers are fine for this function.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // This is needed if you're deploying functions from a browser.
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
    const record = await req.json();

    // Extract email from the new record in the 'newsletter_subscribers' table.
    const userEmail = record?.record?.email;

    if (!userEmail) {
      console.warn("Webhook received without an email in the record.", { record });
      return new Response(
        JSON.stringify({ error: "Email is missing from the new subscriber record." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    // Send the welcome email.
    // IMPORTANT: Replace "from@example.com" with your actual "from" email address.
    const { data, error } = await resend.emails.send({
      from: "Your Name <from@example.com>",
      to: [userEmail],
      subject: "🎉 Welcome to the Newsletter!",
      html: "<h1>Welcome!</h1><p>Thanks for subscribing to our newsletter. We're excited to have you.</p>",
    });

    if (error) {
      console.error("Error sending email via Resend:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Email sent successfully", data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("An unexpected error occurred:", err);
    return new Response(String(err?.message ?? err), {
      status: 500,
      headers: { ...corsHeaders },
    });
  }
});
