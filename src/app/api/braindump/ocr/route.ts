import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageBase64, mimeType } = await req.json();

  if (!imageBase64) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Anthropic API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mimeType || "image/png",
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: "Extract all text from this image. Return only the text content, preserving the original structure and formatting as much as possible. If there are handwritten notes, transcribe them. If there's no readable text, say 'No text found in image.'",
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "AI extraction failed" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text?.trim() || "";

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
