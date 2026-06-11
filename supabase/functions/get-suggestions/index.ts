import Anthropic from "npm:@anthropic-ai/sdk@0.27.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { sleepLogs } = await req.json();

    const client = new Anthropic({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
    });

    const logsText = sleepLogs
      .map((log: any) =>
        `Date: ${log.date}, Bedtime: ${log.bedtime}, Wake: ${log.wake_time}, ` +
        `Duration: ${log.sleep_duration}h, Mood: ${log.mood}/5, Tiredness: ${log.tiredness}/5` +
        (log.notes ? `, Notes: ${log.notes}` : "")
      )
      .join("\n");

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `You are a sleep health coach. Here are the user's recent sleep logs:\n\n${logsText}\n\nGive exactly 3 specific, actionable suggestions to improve this person's sleep quality and daily energy. Be direct and personal. Number them 1, 2, 3. Keep each suggestion to 2-3 sentences max.`,
        },
      ],
    });

    const suggestions =
      message.content[0].type === "text" ? message.content[0].text : "";

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
