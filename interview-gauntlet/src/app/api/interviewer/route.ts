import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
console.log('sending');
  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // 04-mini
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    }
  );

  const data = await response.json();
  // Log the full response for debugging
  console.log("OpenAI API response:", JSON.stringify(data, null, 2));

  // Return the full response for debugging
  return NextResponse.json({
    result: data.choices?.[0]?.message?.content || null,
    openai_response: data,
    error: data.error || null,
  });
} 