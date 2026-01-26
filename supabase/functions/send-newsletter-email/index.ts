import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL"); // Re-added ADMIN_EMAIL constant

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

    // Send the welcome email to the subscriber.
    const { data: subscriberData, error: subscriberError } = await resend.emails.send({
      from: "OERC Newsletter <info@oerc.ca>", // Updated from address
      to: [userEmail],
      subject: "🎉 Welcome to the OERC Newsletter!",
      html: `
  
  <h1>Welcome to the Ontario Educational Research Consortium (OERC) Newsletter</h1>
  <p>Thank you for subscribing and for your interest in advancing educational research.</p>
  <p>You will now receive updates on research initiatives, publications, events, and opportunities to engage with our work.</p>
  <p>If you wish to unsubscribe at any time or have questions, please contact us at 
    <a href="mailto:contact@oerc.ca">contact@oerc.ca</a>.
  </p>
  <p>Warm regards,<br>The OERC Team</p>
  <!-- Logo at the end -->
  <img src="https://drive.google.com/uc?export=view&id=10MGE-Cx0lNcBIrcizMqVYN6OEIw3kvZf" 
       alt="OERC Logo" width="100" 
       style="display:block; margin:20px auto 0 auto;">
`,

    });

    if (subscriberError) {
      console.error("Error sending welcome email via Resend:", subscriberError);
      // Even if subscriber email fails, try to notify admin if possible
    }

    // Send admin notification email
    if (ADMIN_EMAIL) {
      const { data: adminData, error: adminError } = await resend.emails.send({
        from: "OERC Admin Notifications <info@oerc.ca>", // Updated from address
        to: [ADMIN_EMAIL],
        subject: `New Newsletter Subscriber: ${userEmail}`,
        html: `<p>A new user has subscribed to the OERC newsletter:</p><p><strong>Email:</strong> ${userEmail}</p>`,
      });

      if (adminError) {
        console.error("Error sending admin notification email via Resend:", adminError);
      }
    } else {
      console.warn("ADMIN_EMAIL environment variable is not set. Admin will not receive notifications for new subscriptions.");
    }

    if (subscriberError) { // If original subscriber email failed, return that error
      return new Response(JSON.stringify({ error: subscriberError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Emails processed successfully", subscriberEmailData: subscriberData }), {
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
