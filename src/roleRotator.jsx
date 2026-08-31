import { useEffect, useState } from "react";

// Icons intentionally match the SKILL_GROUPS icons in Portfolio.jsx
// (Frontend 🖥, Backend ⚙️, AI/LLM 🧠) so the hero visually echoes
// the skills section below it, instead of introducing new symbols.
const ROLES = [
  { icon: "◆", label: "Software Engineer" },
  { icon: "🖥", label: "Full-Stack Developer" },
  { icon: "⚙️", label: "Backend Engineer" },
  { icon: "🧠", label: "AI / RAG Engineer" },
  { icon: "📱", label: "Mobile Developer" },
];

const ROTATE_MS = 2600;

export default function RoleRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = () => setIndex((i) => (i + 1) % ROLES.length);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || paused) return;

    const id = setInterval(advance, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const role = ROLES[index];

  return (
    <span
      className="role-rotator"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Visually hidden, screen-reader-only full list -- read once,
          normally, instead of a live region re-announcing every
          2.6 seconds, which would be disruptive rather than helpful. */}
      <span className="sr-only">
        {ROLES.map((r) => r.label).join(", ")}
      </span>

      <button
        type="button"
        className="role-rotator-track"
        onClick={advance}
        title="Click to see another role"
      >
        <span className="role-rotator-content" key={index} aria-hidden="true">
          <span className="role-rotator-icon">{role.icon}</span>
          <span className="role-rotator-label">{role.label}</span>
        </span>
      </button>

      <span className="role-rotator-dots" aria-hidden="true">
        {ROLES.map((_, i) => (
          <span
            key={i}
            className={`role-rotator-dot${i === index ? " active" : ""}`}
          />
        ))}
      </span>
    </span>
  );
}