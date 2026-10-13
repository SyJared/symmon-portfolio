// Vercel serverless function: POST /api/chat
// Keeps the Gemini API key server-side, constrains the assistant to the
// portfolio knowledge in _knowledge.js, and STREAMS the reply as plain text
// so the visitor sees words appear immediately instead of waiting for the end.
import { SYSTEM_PROMPT } from "./_knowledge.js";

const MODEL = process.env.ASSISTANT_MODEL || "gemini-3.5-flash-lite";
const MAX_HISTORY = 10;
const MAX_CHARS = 500;
const MAX_TOKENS = 800;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;

// Best-effort per-instance rate limit. Serverless instances don't share
// memory, so treat this as a speed bump, not a guarantee.
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 500) {
    for (const [key, values] of hits) {
      if (!values.some((t) => now - t < WINDOW_MS)) hits.delete(key);
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
  while (messages.length && messages[0].role !== "user") messages.shift();

  // Merge consecutive messages with the same role.
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
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Assistant is not configured." });
  }

  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "You're sending messages too fast. Try again in a minute." });
  }

  const messages = cleanMessages(req.body?.messages);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Invalid request." });
  }

  // Stop paying for tokens nobody will read if the visitor closes the tab.
  const controller = new AbortController();
  res.on("close", () => controller.abort());

  // Headers are only sent with the first chunk, so until then we can still
  // answer with a proper JSON error and status code.
  const emit = (text) => {
    if (!res.headersSent) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("X-Accel-Buffering", "no");
    }
    res.write(text);
  };

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: messages,
          generationConfig: { maxOutputTokens: MAX_TOKENS },
        }),
      }
    );

    if (!upstream.ok) {
      const errorBody = await upstream.text();
      console.error("Gemini API error:", upstream.status, errorBody);

      // Genuinely busy or rate limited: the client shows the traffic message.
      if (upstream.status === 429 || upstream.status === 503) {
        return res.status(503).json({ error: "busy" });
      }
      // Bad key, wrong model name, blocked request: not a traffic problem.
      if ([400, 401, 403, 404].includes(upstream.status)) {
        return res.status(500).json({
          error: "The assistant isn't set up correctly right now. Please use the contact form instead.",
        });
      }
      return res.status(502).json({ error: "The assistant is unavailable right now." });
    }

    if (!upstream.body) {
      return res.status(502).json({ error: "The assistant is unavailable right now." });
    }

    // Gemini streams Server-Sent Events: lines like `data: {json}`.
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let sentAnything = false;

    const handleLine = (line) => {
      if (!line.startsWith("data:")) return;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") return;

      let json;
      try {
        json = JSON.parse(payload);
      } catch {
        return; // ignore a malformed event instead of killing the reply
      }
      const text = (json.candidates?.[0]?.content?.parts || [])
        .filter((p) => typeof p.text === "string" && !p.thought)
        .map((p) => p.text)
        .join("");

      if (text) {
        emit(text);
        sentAnything = true;
      }
    };

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop(); // keep the unfinished line for the next chunk
      lines.forEach(handleLine);
    }
    buffer += decoder.decode();
    if (buffer.trim()) handleLine(buffer.trim());

    if (!sentAnything) emit("Sorry, I couldn't come up with an answer.");
    return res.end();
  } catch (err) {
    if (controller.signal.aborted) return; // visitor left, nothing to send
    console.error("Assistant request failed", err);

    // Partial reply already delivered: just end it cleanly.
    if (res.headersSent) return res.end();
    return res.status(502).json({ error: "The assistant is unavailable right now." });
  }
}