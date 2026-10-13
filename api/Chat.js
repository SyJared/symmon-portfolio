
 // Vercel serverless function: POST /api/chat
 // Keeps the Gemini API key server-side and constrains the assistant
 // to the portfolio knowledge in _knowledge.js.
import { SYSTEM_PROMPT } from "./_knowledge.js";

const MODEL = process.env.ASSISTANT_MODEL || "gemini-3.5-flash-lite";
const MAX_HISTORY = 10;
const MAX_CHARS = 500;
const MAX_TOKENS = 800;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;

// Best-effort per-instance rate limit.
// Set usage limits where available in Google AI Studio as well.
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(
    (t) => now - t < WINDOW_MS
  );

  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 500) {
    for (const [key, values] of hits) {
      if (!values.some((t) => now - t < WINDOW_MS)) {
        hits.delete(key);
      }
    }
  }

  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return [];

  const messages = raw
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.trim().slice(0, MAX_CHARS) }],
    }));

  // Gemini expects the conversation to begin with a user message.
  while (messages.length && messages[0].role !== "user") {
    messages.shift();
  }

  // Merge consecutive messages with the same role.
  // This also prevents invalid role sequences from reaching Gemini.
  const normalized = [];

  for (const message of messages) {
    const previous = normalized[normalized.length - 1];

    if (previous && previous.role === message.role) {
      previous.parts[0].text += "\n" + message.parts[0].text;
    } else {
      normalized.push(message);
    }
  }

  return normalized;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Assistant is not configured.",
    });
  }

  const ip = String(
    req.headers["x-forwarded-for"] || "unknown"
  ).split(",")[0].trim();

  if (rateLimited(ip)) {
    return res.status(429).json({
      error: "You're sending messages too fast. Try again in a minute.",
    });
  }

  const messages = cleanMessages(req.body?.messages);

  if (
    !messages.length ||
    messages[messages.length - 1].role !== "user"
  ) {
    return res.status(400).json({
      error: "Invalid request.",
    });
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: messages,
          generationConfig: {
            maxOutputTokens: MAX_TOKENS,
          },
        }),
      }
    );

    if (!upstream.ok) {
  const errorBody = await upstream.text();

  console.error(
    "Gemini API error:",
    upstream.status,
    errorBody
  );

  return res.status(502).json({
    error: "The assistant is unavailable right now.",
  });
}

    const data = await upstream.json();
const candidate = data.candidates?.[0];

const reply = (candidate?.content?.parts || [])
  .filter((part) => typeof part.text === "string")
  .map((part) => part.text)
  .join("")
  .trim();

// Remove once debugged. Shows why generation stopped and token usage.
console.log("finishReason:", candidate?.finishReason, "usage:", data.usageMetadata);

return res.status(200).json({
  reply: reply || "Sorry, I couldn't come up with an answer.",
});
  } catch (err) {
    console.error("Assistant request failed", err);

    return res.status(502).json({
      error: "The assistant is unavailable right now.",
    });
  }
}
