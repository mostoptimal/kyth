/**
 * Kyth — AI Proxy Worker
 * Uses Cloudflare Workers AI for completion.
 * Model: @cf/meta/llama-3-8b-instruct
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();
      const { prompt } = body;

      if (!prompt || typeof prompt !== "string") {
        return new Response(
          JSON.stringify({ error: "Missing or invalid 'prompt' field" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const result = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      });

      return new Response(
        JSON.stringify({ response: result.response }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(
        JSON.stringify({ error: err.message || "Internal worker error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  },
};
