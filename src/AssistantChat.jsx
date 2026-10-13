import { useState, useRef, useEffect } from "react";
import "./assistantChat.css";

// Floating portfolio guide. Talks to /api/chat (see api/chat.js).
// The assistant can end a reply with [[go:section]] -- we strip that tag
// and render it as a button that scrolls the visitor to the section.

const SECTION_LABELS = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  playground: "Playground",
  freelance: "Freelance",
  contact: "Contact",
};

const SUGGESTIONS = [
  "What's Mon's strongest tech?",
  "Show me his best project",
  "Is he available for freelance?",
  "How do I contact him?",
];

// Change the assistant's name here (and in api/_knowledge.js).
const AI_NAME = "Mys";

const GREETING = `Hi! I'm ${AI_NAME}, Mon's portfolio guide. Ask me about his skills, projects or availability, and I can take you to the right section.`;

const FIRST_MESSAGE = { role: "assistant", content: GREETING };
const TEASER_KEY = "ag-teaser-seen";
const TRAFFIC_MSG =
  "The assistant may be experiencing high traffic right now. Please try again in a moment.";

// sessionStorage can throw (private mode, blocked cookies), so guard it.
const teaserSeen = () => {
  try { return sessionStorage.getItem(TEASER_KEY) === "1"; } catch { return false; }
};
const markTeaserSeen = () => {
  try { sessionStorage.setItem(TEASER_KEY, "1"); } catch { /* storage unavailable */ }
};

function parseReply(text) {
  const match = text.match(/\[\[go:(\w+)\]\]/i);
  const target = match ? match[1].toLowerCase() : null;
  return {
    text: text.replace(/\[\[go:\w+\]\]/gi, "").trim(),
    target: target && SECTION_LABELS[target] ? target : null,
  };
}

/* ---------- Icons ---------- */
const SparkBubble = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-4 4v-4H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
    <path className="ag-spark" d="M12 6.4l1.05 2.55 2.55 1.05-2.55 1.05L12 13.6l-1.05-2.55L8.4 10l2.55-1.05z" fill="currentColor" stroke="none" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);
const ResetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" />
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export default function AssistantChat({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState([FIRST_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  // Teaser bubble: appears once per session, then hides itself.
  useEffect(() => {
    if (teaserSeen()) return;
    const show = setTimeout(() => setTeaser(true), 4500);
    const hide = setTimeout(() => setTeaser(false), 16500);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openChat = () => {
    setOpen(true);
    setTeaser(false);
    markTeaserSeen();
  };
  const dismissTeaser = () => {
    setTeaser(false);
    markTeaserSeen();
  };
  const reset = () => {
    if (loading) return;
    setMessages([FIRST_MESSAGE]);
    setInput("");
  };

  // `base` lets retry() resend without the failed attempt in the history.
  const send = async (raw, base = messages) => {
    const content = raw.trim();
    if (!content || loading) return;

    const next = [...base, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const slowTimer = setTimeout(() => setSlow(true), 4000);

    try {
      const res = await fetch("/api/Chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send visible text only (tags stripped), skip the canned greeting.
        body: JSON.stringify({
          messages: next.slice(1).map((m) => ({
            role: m.role,
            content: m.role === "assistant" ? parseReply(m.content).text : m.content,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.error || "Something went wrong.");
        err.status = res.status;
        throw err;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      // 502/503/504 (upstream busy or down) or no status at all (network
      // failure) -> tell the visitor it may be traffic and let them retry.
      const busy = !err.status || [502, 503, 504].includes(err.status);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: busy ? TRAFFIC_MSG : err.message || "Something went wrong.",
          error: true,
          retry: content,
        },
      ]);
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
      setLoading(false);
    }
  };

  const retry = (content) => {
    const base = messages.slice(0, -2); // drop the failed question + error reply
    setMessages(base);
    send(content, base);
  };

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <>
      {teaser && !open && (
        <div className="ag-teaser" role="status">
          <button className="ag-teaser-text" onClick={openChat}>
            Questions about Mon's work? <strong>Ask {AI_NAME}.</strong>
          </button>
          <button className="ag-teaser-x" onClick={dismissTeaser} aria-label="Dismiss">✕</button>
        </div>
      )}

      {open && (
        <div className="ag-panel" role="dialog" aria-label={`${AI_NAME}, portfolio assistant`}>
          <div className="ag-header">
            <div className="ag-avatar"><SparkBubble /></div>
            <div className="ag-head-text">
              <div className="ag-title">{AI_NAME}</div>
              <div className="ag-status"><i /> ONLINE · MON'S AI GUIDE</div>
            </div>
            <button className="ag-icon-btn" onClick={reset} disabled={loading || messages.length === 1} aria-label="Start a new chat" title="New chat">
              <ResetIcon />
            </button>
            <button className="ag-icon-btn" onClick={() => setOpen(false)} aria-label="Close assistant" title="Close">
              <CloseIcon />
            </button>
          </div>

          <div className="ag-body" ref={bodyRef} aria-live="polite">
            {messages.map((m, i) => {
              const { text, target } = m.role === "assistant" ? parseReply(m.content) : { text: m.content, target: null };
              return (
                <div key={i} className={`ag-msg ${m.role}${m.error ? " error" : ""}`}>
                  <div className="ag-bubble">{text}</div>
                  {target && (
                    <button
                      className="ag-go"
                      onClick={() => {
                        onNavigate(SECTION_LABELS[target]);
                        setOpen(false);
                      }}
                    >
                      Go to {SECTION_LABELS[target]} <ArrowIcon />
                    </button>
                  )}
                  {m.error && m.retry && i === messages.length - 1 && !loading && (
                    <button className="ag-go" onClick={() => retry(m.retry)}>
                      <ResetIcon /> Try again
                    </button>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="ag-msg assistant">
                <div className="ag-bubble ag-typing" aria-label="Assistant is typing">
                  <span /><span /><span />
                </div>
                {slow && <div className="ag-slow">Still working on it. Replies can be slower when traffic is high.</div>}
              </div>
            )}

            {showSuggestions && (
              <>
                <div className="ag-suggest-label">Try asking</div>
                <div className="ag-chips">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="ag-chip" onClick={() => send(s)}>
                      {s} <ArrowIcon />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <form
            className="ag-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              ref={inputRef}
              className="ag-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${AI_NAME} about Mon's work...`}
              maxLength={500}
              aria-label="Your question"
            />
            <button className="ag-send" type="submit" disabled={loading || !input.trim()} aria-label="Send">
              <ArrowIcon />
            </button>
          </form>
          <div className="ag-foot">AI-generated, may be inaccurate. Replies may be slow during busy periods; if one fails, just try again.</div>
        </div>
      )}

      <button
        className={`ag-launcher${open ? " open" : ""}`}
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? `Close ${AI_NAME}` : `Ask ${AI_NAME}, the portfolio assistant`}
        aria-expanded={open}
      >
        <span className="ag-launcher-ring" aria-hidden="true" />
        <span className="ag-launcher-icon">{open ? <CloseIcon /> : <SparkBubble />}</span>
        <span className="ag-launcher-label">{open ? "Close" : `Ask ${AI_NAME}`}</span>
        <span className="ag-launcher-dot" aria-hidden="true" />
      </button>
    </>
  );
}