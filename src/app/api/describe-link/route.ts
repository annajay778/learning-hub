import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Fetch the page content
    const res = await fetch(url, {
      headers: { "User-Agent": "LearningHub/1.0" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Could not fetch the URL" },
        { status: 422 }
      );
    }

    const html = await res.text();

    // Strip HTML tags, collapse whitespace, take first chunk
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);

    // If the page is a client-rendered SPA, we'll get very little text.
    // Use a higher threshold and fall back to URL-only description.
    const hasContent = text.length >= 100;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 }
      );
    }

    const prompt = hasContent
      ? `Based on this page content, write a 1-2 sentence description of the demo or prototype. Be specific about features shown. No hype, no filler.\n\nURL: ${url}\nPage content:\n${text}`
      : `This URL points to a web app but I couldn't extract its content (it's likely a client-rendered SPA). Based only on the URL, write a 1-2 sentence description of what this demo or prototype likely does. Be specific if the URL gives clues. If you truly can't tell, say "Could not auto-detect — please add a description manually."\n\nURL: ${url}`;

    const completion = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 150,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!completion.ok) {
      return NextResponse.json(
        { error: "AI generation failed" },
        { status: 500 }
      );
    }

    const data = await completion.json();
    const description =
      data.content?.[0]?.text?.trim() || "";

    return NextResponse.json({ description });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch or process the URL" },
      { status: 500 }
    );
  }
}
