/**
 * Cloudflare Worker — AI Proxy for Deep Life Analysis
 * 
 * Deploy this as a Cloudflare Worker, then bind it to your HTML page.
 * The AI token stays server-side; only the Worker URL is exposed.
 * 
 * SETUP:
 * 1. Create a Worker at: https://dash.cloudflare.com/workers
 * 2. Add a Cloudflare Workers AI binding:
 *    - Name: AI
 *    - Type: Workers AI
 *    - Model: @cf/meta/llama-3.1-8b-instruct (or any available model)
 * 3. Deploy this script
 * 4. Update the AI_ENDPOINT in your HTML to your Worker URL
 *    e.g. https://deep-life-ai.your-subdomain.workers.dev/ai
 */

export default {
  async fetch(request, env, ctx) {
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
      const { prompt, model } = body;

      if (!prompt || typeof prompt !== "string") {
        return new Response(
          JSON.stringify({ error: "Missing or invalid 'prompt' field" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const aiModel = model || "@cf/meta/llama-3.1-8b-instruct";

      const aiResponse = await env.AI.run(aiModel, {
        messages: [{ role: "user", content: prompt }],
        stream: true,
      });

      return new Response(aiResponse, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "X-Model": aiModel,
          ...corsHeaders,
        },
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(
        JSON.stringify({ error: err.message || "Internal worker error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  },
};
