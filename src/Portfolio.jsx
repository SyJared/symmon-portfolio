import { useState, useEffect, useRef } from "react";
import './index.css'
import me from '/me.png'
import emailjs from "@emailjs/browser";
import MinilangPlayground from "./backend/MinilangPlayground";
import ProjectsSlider from "./projectsSlider";
import RoleRotator from "./roleRotator";
import symdocd from "/symdocd.png";
import symdocq from "/symdocq.png";
import symmonidash from "/symmonidash.png";
import symmonibat from "/symmonibat.png";
import symmoniproc from "/symmoniproc.png";
import flowdash from "/flowdash.png";
import flowinwork from "/flowinwork.png";
import flowworkspace from "/flowworkspace.png";
import flowtask from "/flowtask.png";



const NAV_LINKS = ["About", "Skills", "Projects", "Playground", "Contact"];

const SKILL_GROUPS = [
  {
    group: "Frontend",
    color: "#8fcbff",
    icon: "🖥",
    skills: [
      "React",
      "React Router",
      "React Native",
      "Expo",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "Vite"
    ],
  },
  {
    group: "Backend",
    color: "#5fa8e8",
    icon: "⚙️",
    skills: [
      "Java",
      "Spring Boot",
      "C#",
      "ASP.NET Core",
      "Node.js",
      "Express.js",
      "REST APIs",
      "WebSockets",
      "JWT Authentication"
    ],
  },
  {
    group: "Database",
    color: "#3d7fc4",
    icon: "🗄",
    skills: [
      "MySQL",
      "PostgreSQL",
      "SQL"
    ],
  },
  {
    group: "Cloud",
    color: "#bfe4ff",
    icon: "☁️",
    skills: [
      "AWS (EC2, S3, Aurora)",
      "Azure (App Service, Container Apps)",
    ],
  },
  {
    group: "AI / LLM Engineering",
    color: "#ff5a36",
    icon: "🧠",
    skills: [
      "RAG (Retrieval-Augmented Generation)",
      "LLM APIs (Claude, Gemini)",
      "Prompt Engineering",
      "Vector Embeddings",
      "pgvector",
      "Semantic Search",
      "Structured Outputs",
      "Hallucination Mitigation"
    ],
  },
  {
    group: "Tools",
    color: "#2e5f99",
    icon: "🛠",
    skills: [
      "Git",
      "GitHub",
      "GitHub Actions",
      "Docker",
      "Linux",
      "Tailscale",
      "EAS Build",
      "Postman"
    ],
  },
  {
    group: "Other",
    color: "#6f93b8",
    icon: "✦",
    skills: [
      "Zod Validation",
      "bcrypt",
      "API Key Authentication",
      "Middleware",
      "Role-Based Access Control",
      "Object-Oriented Programming",
      "Compiler Design (Lexer, Parser, AST, Interpreter)"
    ],
  },
];

const PROJECTS = [
  {
    id: "symdoc",
    title: "SymDoc",
    tag: "AI / RAG",
    year: "2026",
    icon: "🧠",
    description:
      "A full-stack Retrieval-Augmented Generation app that lets you upload documents and ask questions answered strictly from their content. Chunks and embeds documents with Voyage AI, stores vectors in PostgreSQL via pgvector, and generates answers with Gemini constrained to a structured JSON schema. A custom grounding layer verifies every cited quote against the retrieved source text before it's shown, so answers come with a code-checked trust signal — not just the model's own confidence.",
    stack: ["React", "Node.js", "Express.js", "PostgreSQL", "pgvector", "Voyage AI", "Gemini API"],
    screenshots: [symdocd, symdocq],
    demo: "https://sym-doc-tau.vercel.app",
    github: "https://github.com/SyJared/SymDoc",
    color: "#ff5a36",
    buildNotes: [
      {
        issue: "Vector search silently returned zero results despite matching data clearly existing in the table.",
        fix: "Isolated the bug by testing the plain SQL JOIN with no vector logic first — it worked. Traced it to the pgvector ivfflat index, which clusters vectors into buckets for speed but needs real data volume to route queries correctly; with only a handful of rows, it was searching an empty bucket. Removed the index for this scale — an exact scan is both faster and more accurate below a few thousand rows.",
      },
      {
        issue: "Backend crashed on startup with 'Cannot find module' and 'Unexpected token export' errors.",
        fix: "Root cause was mixing CommonJS (require/module.exports) and ES Modules (import/export) across different service files. Standardized the entire backend on CommonJS and used Node's own stack trace to find each mismatched file one by one.",
      },
      {
        issue: "Database connection failed with 'password authentication failed' even with the correct password.",
        fix: "A natively-installed Postgres service was silently occupying the default port, intercepting connections meant for a separate Dockerized Postgres+pgvector instance. Remapped the Docker container to a different port instead of touching either service's config.",
      },
      {
        issue: "Insert failed with 'expected 512 dimensions, not 1024' after switching embedding models.",
        fix: "The database schema was hard-coded for the previous model's output size. Updated the vector column to match the new model's actual dimension, and now treat embedding dimension as an explicit, checked assumption rather than a magic number.",
      },
    ],
  },
  {
    id: "symmoni",
    title: "SymMoni",
    tag: "Systems / Mobile",
    year: "2026",
    icon: "📡",
    description:
      "A cross-platform laptop monitoring system pairing a Spring Boot + OSHI backend with a React Native mobile app. Streams live CPU, memory, disk, network, and battery stats over WebSockets, supports remote process management, and is secured with custom API-key authentication and Tailscale for access from anywhere.",
    stack: ["React Native", "Spring Boot", "OSHI", "WebSockets", "Tailscale"],
    screenshots: [symmonidash, symmonibat, symmoniproc],
    demo: "",
    github: "https://github.com/SyJared/SymMoni",
    color: "#8fcbff",
  },
  {
    id: "flow",
    title: "Flow",
    tag: "Productivity",
    year: "2026",
    icon: "⚡",
    description:
      "A collaborative workspace inspired by Jira and Trello. Supports multiple workspaces, task boards, role-based access, task assignments, authentication, and team collaboration through a responsive web application.",
    stack: ["React", "Express.js", "Node.js"],
    screenshots: [flowdash, flowinwork, flowworkspace, flowtask],
    demo: "https://flow-demo-gold.vercel.app",
    github: "https://github.com/SyJared/flow",
    color: "#3d7fc4",
  },
  {
    id: "schoolmis",
    title: "SchoolMIS",
    tag: "Productivity",
    year: "2026",
    icon: "🏛️",
    description:
      "A role-based School Management Information System that enables administrators and teachers to manage classrooms, students, attendance, and grades through a centralized web application built with ASP.NET Core and React.",
    stack: ["React", "C#", "ASP.NET Core", "PostgreSQL"],
    screenshots: [],
    demo: "",
    github: "https://github.com/SyJared/SchoolMIS",
    color: "#bfe4ff",
  },
  {
    id: "digibarangay",
    title: "DigiBarangay",
    tag: "Civic Tech",
    year: "2025",
    icon: "🏛️",
    description:
      "A digital barangay management platform that streamlines community services through online document requests, announcements, notifications, and resident record management.",
    stack: ["React", "PHP", "MySQL"],
    screenshots: [],
    demo: "",
    github: "https://github.com/SyJared/digibaranggay",
    color: "#5fa8e8",
  },
  {
    id: "symlang",
    title: "SymLang",
    tag: "Programming Language",
    year: "2026",
    icon: "💻",
    description:
      "A custom interpreted programming language built in Java featuring a lexer, recursive-descent parser, Abstract Syntax Tree (AST), and interpreter. Integrated with a Spring Boot REST API and deployed backend, allowing users to execute SymLang code directly from my portfolio. You can see the live demo below ↓",
    stack: ["Java", "Spring Boot", "Docker", "REST API"],
    screenshots: [],
    demo: "",
    github: "https://github.com/SyJared/symlang-api",
    color: "#ffb020",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}



export default function Portfolio() {
  const [activeNav, setActiveNav] = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroRef, heroInView] = useInView(0.1);
  const [aboutRef, aboutInView] = useInView(0.1);
  const [skillsRef, skillsInView] = useInView(0.1);
  const [projectsRef, projectsInView] = useInView(0.1);
  const [contactRef, contactInView] = useInView(0.1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(null);

 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id);
    setMenuOpen(false);
  };

  const handleCopy = ({label, value}) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

   const form = useRef();

 const showToast = (type, message, sub) => {
  const existing = document.getElementById("toast-container");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "toast-container";
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : "✗"}</span>
    <div class="toast-msg">
      ${message}
      ${sub ? `<span>${sub}</span>` : ""}
    </div>
    <div class="toast-bar"></div>
  `;
  toast.className = `toast ${type}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
    const bar = toast.querySelector(".toast-bar");
    bar.style.transition = "transform 3.2s linear";
    bar.style.transform = "scaleX(0)";
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
};

const sendEmail = (e) => {
  e.preventDefault();

  emailjs.sendForm("service_64hb1z9", "template_uq4w7e8", form.current, "jMxsifjnpdHnFdQtK")
    .then(() => {
      showToast("success", "Message sent!", "I'll get back to you soon.");
      e.target.reset();
    })
    .catch(() => {
      showToast("error", "Something went wrong.", "Please try again later.");
    });
};

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #0a1f3d; color: #eaf3ff; font-family: 'IBM Plex Mono', monospace; overflow-x: hidden; margin-top: -5rem; }
    ::selection { background: rgba(255,90,54,0.3); color: #fff; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0a1f3d; }
    ::-webkit-scrollbar-thumb { background: #3d7fc4; border-radius: 2px; }

    .cursor-glow {
      position: fixed;
      top: 0; left: 0;
      width: 400px; height: 400px;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(circle, rgba(255,90,54,0.05) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: transform 0.1s ease;
    }
    .toast {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      opacity: 0;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #0f2a52;
      border: 1px solid #5fa8e855;
      border-radius: 4px;
      padding: 12px 18px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      color: #eaf3ff;
      min-width: 240px;
      z-index: 9999;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
      pointer-events: none;
      overflow: hidden;
    }
    .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    .toast.success .toast-icon { color: #8fcbff; }
    .toast.error .toast-icon { color: #ff5a36; }
    .toast.error { border-color: #ff5a3655; }
    .toast-icon { font-size: 16px; flex-shrink: 0; }
    .toast-msg span { display: block; font-size: 11px; color: #7691b8; margin-top: 2px; }
    .toast-bar {
      position: absolute;
      bottom: 0; left: 0;
      height: 2px;
      width: 100%;
      background: #5fa8e8aa;
      transform-origin: left;
      transform: scaleX(1);
    }
    .toast.error .toast-bar { background: #ff5a36aa; }

    .noise {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    /* Blueprint graph paper: minor grid + heavier major grid, the
       defining structural signature instead of a decorative texture. */
    .grid-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(143,203,255,0.09) 1px, transparent 1px),
        linear-gradient(90deg, rgba(143,203,255,0.09) 1px, transparent 1px),
        linear-gradient(rgba(143,203,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(143,203,255,0.03) 1px, transparent 1px);
      background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
    }

    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 1.2rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s ease;
    }
    nav.scrolled {
      background: rgba(10,31,61,0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(143,203,255,0.12);
    }

    .nav-logo {
      font-family: 'Big Shoulders Display', sans-serif;
      font-weight: 800;
      font-size: 1.4rem;
      text-transform: uppercase;
      color: #fff;
      cursor: pointer;
      letter-spacing: 0.01em;
    }
    .nav-logo span { color: #ff5a36; }

    .nav-links { display: flex; gap: 2.5rem; list-style: none; }
    .nav-links li {
      font-size: 0.72rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      cursor: pointer;
      color: #7691b8;
      transition: color 0.2s;
      position: relative;
      padding-bottom: 2px;
    }
    .nav-links li::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 0; height: 1px;
      background: #8fcbff;
      transition: width 0.3s ease;
    }
    .nav-links li:hover, .nav-links li.active { color: #fff; }
    .nav-links li:hover::after, .nav-links li.active::after { width: 100%; }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      z-index: 200;
    }
    .hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background: #eaf3ff;
      transition: all 0.3s ease;
    }

    .mobile-menu {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 150;
      background: rgba(10,31,61,0.97);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
    }
    .mobile-menu.open { display: flex; }
    .mobile-menu li {
      font-family: 'Big Shoulders Display', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      text-transform: uppercase;
      list-style: none;
      cursor: pointer;
      color: #eaf3ff;
      letter-spacing: 0.01em;
      transition: color 0.2s;
    }
    .mobile-menu li:hover { color: #ff5a36; }

    section { position: relative; z-index: 1; }

    /* HERO */
    #about {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 0 2.5rem;
      padding-top: 5rem;
    }
    .hero-inner {
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    .hero-label {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #8fcbff;
      margin-bottom: 1.2rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.8s ease;
    }
    .hero-label.visible { opacity: 1; transform: translateY(0); }
    .hero-label::after {
      content: '';
      display: block;
      margin-top: 0.6rem;
      width: 56px;
      height: 1px;
      background: #5fa8e8;
      box-shadow: 0 -3px 0 -2px #5fa8e8, 56px -3px 0 -2px #5fa8e8;
    }

    .hero-name {
      font-family: 'Big Shoulders Display', sans-serif;
      font-weight: 800;
      text-transform: uppercase;
      font-size: clamp(3rem, 3vw, 5.5rem);
      line-height: 0.92;
      letter-spacing: -0.01em;
      color: #fff;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.9s ease 0.1s;
    }
    .hero-name.visible { opacity: 1; transform: translateY(0); }
    .hero-name .accent { color: #ff5a36; }

    .hero-role {
      font-size: 0.8rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #7691b8;
      margin-top: 1.2rem;
      margin-bottom: 1.8rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.8s ease 0.2s;
    }
    .hero-role.visible { opacity: 1; transform: translateY(0); }

    .hero-role {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .hero-role-prefix {
      font-size: 0.8rem;
      letter-spacing: 0.04em;
      color: #7691b8;
    }

    /* Standard visually-hidden-but-accessible utility -- content is
       present for screen readers, invisible and non-disruptive for
       sighted users. */
    .sr-only {
      position: absolute;
      width: 1px; height: 1px;
      padding: 0; margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .role-rotator {
      display: inline-flex;
      align-items: center;
      gap: 0.7rem;
    }

    /* Real <button>, so it's keyboard-focusable and semantically a
       control, not just decorative text -- but visually it should read
       as emphasized text, not as a boxed UI button. */
    .role-rotator-track {
      display: inline-flex;
      align-items: center;
      gap: 0.4em;
      background: none;
      border: none;
      border-bottom: 1px dashed rgba(255,90,54,0.4);
      padding: 0 0 2px;
      cursor: pointer;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      color: #ff5a36;
      animation: roleRotateIn 0.4s ease;
      transition: color 0.2s ease, border-color 0.2s ease;
    }

    .role-rotator-track:hover {
      color: #ff7a5c;
      border-bottom-color: #ff7a5c;
    }

    .role-rotator-track:focus-visible {
      outline: 1px solid #ff5a36;
      outline-offset: 3px;
    }

    @keyframes roleRotateIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .role-rotator-icon {
      font-size: 0.9em;
    }

    .role-rotator-dots {
      display: inline-flex;
      gap: 0.3rem;
    }

    .role-rotator-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(143,203,255,0.2);
      transition: background 0.3s ease, transform 0.3s ease;
    }

    .role-rotator-dot.active {
      background: #ff5a36;
      transform: scale(1.3);
    }

    .hero-bio {
      font-size: 0.88rem;
      line-height: 1.8;
      color: #7691b8;
      max-width: 480px;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.8s ease 0.3s;
    }
    .hero-bio.visible { opacity: 1; transform: translateY(0); }

    .hero-cta {
      display: flex;
      gap: 1rem;
      margin-top: 2.5rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.8s ease 0.4s;
    }
    .hero-cta.visible { opacity: 1; transform: translateY(0); }

    /* Buttons: registration-mark corners instead of the old diagonal
       clip-path cut -- a drafting/alignment-mark motif. */
    .btn-primary {
      position: relative;
      padding: 0.75rem 2rem;
      background: #ff5a36;
      color: #0a1f3d;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.72rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary::before, .btn-primary::after {
      content: '';
      position: absolute;
      width: 8px; height: 8px;
      border: 1.5px solid #0a1f3d;
      opacity: 0.5;
    }
    .btn-primary::before { top: 3px; left: 3px; border-right: none; border-bottom: none; }
    .btn-primary::after { bottom: 3px; right: 3px; border-left: none; border-top: none; }
    .btn-primary:hover { background: #ff7a5c; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,90,54,0.3); }

    .btn-secondary {
      padding: 0.75rem 2rem;
      background: transparent;
      color: #eaf3ff;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.72rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border: 1px solid rgba(143,203,255,0.25);
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: #8fcbff; color: #8fcbff; transform: translateY(-2px); }
    .btn-secondary a,
    a.btn-secondary {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      line-height: 1;
    }
    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transform: translateX(30px);
      transition: all 1s ease 0.3s;
    }
    .hero-visual.visible { opacity: 1; transform: translateX(0); }

    /* Avatar frame: corner brackets like a camera/drafting reticle,
       instead of a neon diagonal gradient border. */
    .avatar-frame {
      position: relative;
      width: 280px;
      height: 280px;
      padding: 14px;
    }
    .avatar-frame::before {
      content: '';
      position: absolute;
      inset: 0;
      border: 1px solid rgba(143,203,255,0.18);
    }
    .avatar-frame::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(#8fcbff, #8fcbff) top left / 22px 2px no-repeat,
        linear-gradient(#8fcbff, #8fcbff) top left / 2px 22px no-repeat,
        linear-gradient(#8fcbff, #8fcbff) top right / 22px 2px no-repeat,
        linear-gradient(#8fcbff, #8fcbff) top right / 2px 22px no-repeat,
        linear-gradient(#8fcbff, #8fcbff) bottom left / 22px 2px no-repeat,
        linear-gradient(#8fcbff, #8fcbff) bottom left / 2px 22px no-repeat,
        linear-gradient(#8fcbff, #8fcbff) bottom right / 22px 2px no-repeat,
        linear-gradient(#8fcbff, #8fcbff) bottom right / 2px 22px no-repeat;
      opacity: 0.7;
      pointer-events: none;
    }
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0f2a52, #123a6b);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .avatar-icon { font-size: 4rem; }
    .avatar-text { font-size: 0.65rem; letter-spacing: 0.15em; color: #7691b8; text-transform: uppercase; }

    .floating-badge {
      position: absolute;
      background: rgba(10,31,61,0.92);
      border: 1px solid rgba(143,203,255,0.25);
      padding: 0.6rem 1rem;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      white-space: nowrap;
    }
    .badge-1 { top: -16px; right: -24px; color: #ff5a36; border-color: rgba(255,90,54,0.3); }
    .badge-2 { bottom: -16px; left: -24px; color: #8fcbff; }
    .badge-3 { top: 50%; left: -60px; transform: translateY(-50%); color: #7691b8; border-color: rgba(143,203,255,0.15); }

    /* SECTION SHARED */
    .section-wrap {
      max-width: 1100px;
      margin: 0 auto;
      padding: 6rem 2.5rem;
    }

    .section-label {
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #8fcbff;
      margin-bottom: 0.9rem;
      opacity: 0;
      transform: translateY(16px);
      transition: all 0.6s ease;
    }
    .section-label.visible { opacity: 1; transform: translateY(0); }
    .section-label::after {
      content: '';
      display: block;
      margin-top: 0.6rem;
      width: 48px;
      height: 1px;
      background: #5fa8e8;
      box-shadow: 0 -3px 0 -2px #5fa8e8, 48px -3px 0 -2px #5fa8e8;
    }

    .section-title {
      font-family: 'Big Shoulders Display', sans-serif;
      font-size: clamp(2rem, 3.5vw, 3.2rem);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.01em;
      line-height: 1;
      color: #fff;
      margin-bottom: 3.5rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.7s ease 0.1s;
    }
    .section-title.visible { opacity: 1; transform: translateY(0); }
    .section-title .dim { color: #ff5a36; }

    /* SKILLS */
    #skills { background: rgba(143,203,255,0.02); }
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .skill-card {
      border: 1px solid rgba(143,203,255,0.14);
      padding: 1.6rem;
      background: rgba(15,42,82,0.5);
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(24px);
      position: relative;
      overflow: hidden;
    }
    .skill-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      transition: opacity 0.3s;
      opacity: 0.8;
    }
    .skill-card.visible { opacity: 1; transform: translateY(0); }
    .skill-card:hover {
      transform: translateY(-4px);
      background: rgba(18,58,107,0.6);
      border-color: rgba(143,203,255,0.28);
    }
    .skill-group-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.2rem;
    }
    .skill-group-icon { font-size: 1.2rem; }
    .skill-group-name {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #fff;
    }
    .skill-group-count {
      margin-left: auto;
      font-size: 0.62rem;
      letter-spacing: 0.12em;
      color: #3d5a80;
    }
    .skill-divider {
      height: 1px;
      background: rgba(143,203,255,0.1);
      margin-bottom: 1.2rem;
    }
    .skill-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .skill-pill {
      font-size: 0.68rem;
      letter-spacing: 0.06em;
      padding: 0.35rem 0.85rem;
      border: 1px solid;
      transition: all 0.2s;
      cursor: default;
    }
    .skill-pill:hover {
      transform: translateY(-2px);
    }

    /* PROJECTS */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 380px));
      justify-content: center;
      gap: 1.5rem;
    }

    .project-card {
      display: block;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      padding: 1.25rem 1.25rem 3.25rem;
      border: 1px solid rgba(143,203,255,0.14);
      background: rgba(15,42,82,0.5);
      opacity: 0;
      transform: translateY(28px);
      transition:
        transform 0.35s ease,
        box-shadow 0.35s ease,
        border-color 0.35s ease,
        opacity 0.35s ease;
    }

    .project-card.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .project-card:hover {
      transform: translateY(-10px);
      border-color: rgba(143,203,255,0.3);
    }

    /* Corner registration marks, inset so overflow:hidden never clips them */
    .project-card::after, .skill-card::after {
      content: '';
      position: absolute;
      top: 8px; left: 8px;
      width: 10px; height: 10px;
      border-top: 1.5px solid rgba(143,203,255,0.4);
      border-left: 1.5px solid rgba(143,203,255,0.4);
      pointer-events: none;
      z-index: 3;
    }

    .project-card > * {
      position: relative;
      z-index: 2;
    }

    .project-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .project-icon {
      font-size: 2.2rem;
    }

    .project-meta {
      text-align: right;
    }

    .project-tag {
      font-size: 0.6rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 0.3rem 0.8rem;
      border: 1px solid;
      display: inline-block;
      margin-right: 3rem;
    }

    .project-year {
      font-size: 0.65rem;
      color: #7691b8;
      margin-top: 0.4rem;
    }

    .project-title {
      font-family: 'Big Shoulders Display', sans-serif;
      font-size: 1.6rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.01em;
      color: #fff;
      margin-bottom: 0.55rem;
    }

    .project-desc {
      font-size: 0.82rem;
      line-height: 1.5;
      color: #7691b8;
      margin-bottom: 0.65rem;
    }

    .project-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-bottom: 0.4rem;
    }

    .stack-tag {
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.25rem 0.7rem;
      background: rgba(143,203,255,0.05);
      border: 1px solid rgba(143,203,255,0.16);
      color: #8fa9c9;
    }

    .project-glow {
      position: absolute;
      bottom: -120px;
      right: -120px;
      width: 260px;
      height: 260px;
      background: radial-gradient(
        circle,
        var(--card-color),
        transparent 60%
      );
      filter: blur(40px);
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
      z-index: 0;
    }

    .project-card:hover .project-glow {
      opacity: 0.18;
    }

    .project-github-btn {
      position: absolute;
      top: -0.2rem;
      right: -0.3rem;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 1px solid rgba(143,203,255,0.16);
      background: rgba(15,42,82,0.4);
      color: #7691b8;
      backdrop-filter: blur(6px);
      cursor: pointer;
      transform: translateY(-6px);
      pointer-events: auto;
      transition: all 0.25s ease;
    }

    .project-github-btn:hover {
      transform: translateY(-2px);
      border-color: rgba(143,203,255,0.35);
      color: #fff;
      background: rgba(18,58,107,0.6);
    }

    .project-hover-hint {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      color: rgba(234,243,255,0.35);
      opacity: 0;
      transform: translateY(6px);
      transition: all 0.25s ease;
    }

    .project-card:hover .project-hover-hint {
      opacity: 1;
      transform: translateY(0);
      color: rgba(234,243,255,0.75);
    }

    .project-footer {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
    }

    .project-cta {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      padding: 0.35rem 0.75rem;
      background: rgba(143,203,255,0.05);
      border: 1px solid rgba(143,203,255,0.16);
      color: #7691b8;
      opacity: 0;
      transform: translateY(6px);
      pointer-events: auto;
      transition: all 0.25s ease;
    }
    .project-cta:hover {
      cursor: pointer;
      transform: translateY(-2px);
      color: #fff;
      border-color: rgba(143,203,255,0.35);
      background: rgba(18,58,107,0.6);
    }

    .project-card:hover .project-cta {
      cursor: pointer;
      transform: translateY(6px);
      opacity: 1;
    }

    /* CONTACT */
    #contact { background: rgba(143,203,255,0.02); }
    .contact-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }
    .contact-blurb {
      font-size: 0.88rem;
      line-height: 1.8;
      color: #7691b8;
      margin-bottom: 2rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.7s ease 0.2s;
    }
    .contact-blurb.visible { opacity: 1; transform: translateY(0); }
    .contact-links {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.7s ease 0.3s;
    }
    .contact-links.visible { opacity: 1; transform: translateY(0); }
    .contact-link-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.2rem;
      border: 1px solid rgba(143,203,255,0.14);
      cursor: pointer;
      transition: all 0.2s;
    }
    .contact-link-item:hover {
      border-color: rgba(143,203,255,0.35);
      background: rgba(143,203,255,0.04);
    }
    .contact-link-icon { font-size: 1.1rem; }
    .contact-link-label { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: #7691b8; flex: 1; }
    .contact-link-value { font-size: 0.78rem; color: #eaf3ff; }
    .contact-link-arrow { color: #ff5a36; font-size: 0.8rem; }

    .contact-form {
      opacity: 0;
      transform: translateX(24px);
      transition: all 0.8s ease 0.3s;
    }
    .contact-form.visible { opacity: 1; transform: translateX(0); }

    .form-group { margin-bottom: 1.2rem; }
    .form-label {
      display: block;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #7691b8;
      margin-bottom: 0.5rem;
    }
    .form-input, .form-textarea {
      width: 100%;
      background: rgba(143,203,255,0.05);
      border: 1px solid rgba(143,203,255,0.16);
      padding: 0.85rem 1rem;
      color: #eaf3ff;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.82rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-input:focus, .form-textarea:focus { border-color: rgba(143,203,255,0.5); }
    .form-textarea { resize: vertical; min-height: 120px; }
    ::placeholder { color: #3d5a80; }

    /* FOOTER */
    footer {
      border-top: 1px solid rgba(143,203,255,0.1);
      padding: 2rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .footer-name {
      font-family: 'Big Shoulders Display', sans-serif;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 1rem;
      color: #fff;
    }
    .footer-copy { font-size: 0.7rem; color: #3d5a80; }

    /* ============================================================
   PROJECTS SLIDER — add this block to your existing <style> string
   ============================================================ */

.projects-slide-section {
  position: relative;
  overflow: hidden;
}

.projects-slide-glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  pointer-events: none;
  z-index: 0;
  transition: background 0.5s ease;
}

.projects-slide-wrap {
  position: relative;
  z-index: 1;
}

.project-slide-counter {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #3d5a80;
  margin-bottom: 1.5rem;
}

.project-slide-content {
  border: 1px solid rgba(143,203,255,0.14);
  background: rgba(15,42,82,0.4);
  padding: 2rem;
  position: relative;
  animation: slideFade 0.4s ease;
}

@keyframes slideFade {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}

/* This markup reuses .project-card-header/.project-tag/.project-github-btn
   etc. from the old grid-card CSS, but here they sit inside a normal flex
   row rather than an absolutely-positioned overlay -- these overrides
   neutralize the old absolute/hover-hidden behavior specifically inside
   the slider so they render as plain, always-visible flex items instead. */
.project-slide-content .project-github-btn {
  position: static;
  transform: none;
  margin-left: auto;
}

.project-slide-content .project-tag {
  margin-right: 0;
}

.project-slide-content .project-cta {
  opacity: 1;
  transform: none;
  position: static;
  pointer-events: auto;
}

.project-slide-content .project-footer {
  position: static;
  margin-top: 1.5rem;
}

.project-slide-title {
  font-family: 'Big Shoulders Display', sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: #fff;
  margin: 0.75rem 0 1rem;
}

.project-slide-desc {
  font-size: 0.9rem;
  line-height: 1.7;
  color: #a3b8d4;
  max-width: 640px;
  margin-bottom: 1.25rem;
}

/* Two columns when screenshots exist: info on the left, a vertically
   scrollable screenshot stack on the right. With no screenshots,
   .has-media is never added, so this stays a single flowing column --
   unchanged from before. */
.project-slide-body.has-media {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 320px);
  gap: 2rem;
  align-items: start;
}

.project-slide-info {
  min-width: 0;
}

/* BUILD NOTES: styled like a technical drawing's revision/annotation
   log -- numbered entries, ISSUE/FIX labeled rows, redline for the
   problem and blueprint-blue for the resolution. */
.build-notes {
  margin-top: 1.1rem;
}

.build-notes-toggle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8fcbff;
  transition: color 0.2s ease;
}

.build-notes-toggle:hover {
  color: #bfe4ff;
}

.build-notes-chevron {
  display: inline-block;
  font-size: 0.7rem;
  transition: transform 0.2s ease;
}

.build-notes-chevron.open {
  transform: rotate(90deg);
}

.build-notes-count {
  font-size: 0.62rem;
  color: #3d5a80;
  border: 1px solid rgba(143,203,255,0.25);
  padding: 0.1rem 0.4rem;
}

.build-notes-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: notesExpand 0.25s ease;
}

@keyframes notesExpand {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.build-note {
  display: flex;
  gap: 0.9rem;
  border-left: 2px solid rgba(143,203,255,0.18);
  padding-left: 0.9rem;
}

.build-note-index {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.68rem;
  color: #3d5a80;
  flex-shrink: 0;
  padding-top: 0.1rem;
}

.build-note-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.build-note-row {
  display: flex;
  gap: 0.6rem;
  align-items: baseline;
}

.build-note-row p {
  font-size: 0.8rem;
  line-height: 1.55;
  color: #a3b8d4;
  margin: 0;
}

.build-note-label {
  flex-shrink: 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.15rem 0.4rem;
  border: 1px solid;
  align-self: flex-start;
  margin-top: 0.15rem;
}

.build-note-label.issue {
  color: #ff5a36;
  border-color: rgba(255,90,54,0.35);
}

.build-note-label.fix {
  color: #8fcbff;
  border-color: rgba(143,203,255,0.3);
}

.project-slide-screenshots {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;
}

.project-slide-screenshot {
  flex: 0 0 auto;
  width: 100%;
  aspect-ratio: 16 / 10;
  border: 1px solid rgba(143,203,255,0.18);
  overflow: hidden;
  background: #0a1f3d;
  position: relative;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.project-slide-screenshot:hover {
  border-color: rgba(143,203,255,0.5);
}

.project-slide-screenshot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.project-slide-screenshot:hover img {
  transform: scale(1.04);
}

.screenshot-zoom-hint {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10,31,61,0.85);
  border: 1px solid rgba(143,203,255,0.3);
  color: #8fcbff;
  font-size: 0.85rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.project-slide-screenshot:hover .screenshot-zoom-hint {
  opacity: 1;
}

/* LIGHTBOX MODAL */
.screenshot-modal {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(6,16,32,0.94);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  animation: modalFadeIn 0.2s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.screenshot-modal-img {
  max-width: 85vw;
  max-height: 82vh;
  object-fit: contain;
  border: 1px solid rgba(143,203,255,0.25);
  cursor: default;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.screenshot-modal-close {
  position: absolute;
  top: 24px;
  right: 28px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(143,203,255,0.25);
  color: #eaf3ff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.screenshot-modal-close:hover {
  border-color: #ff5a36;
  color: #ff5a36;
  transform: rotate(90deg);
}

.screenshot-modal-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10,31,61,0.7);
  border: 1px solid rgba(143,203,255,0.25);
  color: #eaf3ff;
  font-size: 1.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.screenshot-modal-arrow:hover {
  border-color: #8fcbff;
  background: rgba(18,58,107,0.8);
}

.screenshot-modal-arrow.left { left: 24px; }
.screenshot-modal-arrow.right { right: 24px; }

.screenshot-modal-counter {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #7691b8;
  background: rgba(10,31,61,0.7);
  border: 1px solid rgba(143,203,255,0.16);
  padding: 0.4rem 0.9rem;
}

@media (max-width: 768px) {
  .screenshot-modal-arrow { width: 40px; height: 40px; font-size: 1.3rem; }
  .screenshot-modal-arrow.left { left: 10px; }
  .screenshot-modal-arrow.right { right: 10px; }
  .screenshot-modal-close { top: 14px; right: 14px; }
}

@media (max-width: 900px) {
  .project-slide-body.has-media {
    grid-template-columns: 1fr;
  }
  .project-slide-screenshots {
    flex-direction: row;
    max-height: none;
    overflow-x: auto;
    overflow-y: visible;
  }
  .project-slide-screenshot {
    width: 240px;
  }
}

.project-slide-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.project-slide-arrow {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(143,203,255,0.2);
  background: transparent;
  color: #8fcbff;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-slide-arrow:hover {
  border-color: #8fcbff;
  background: rgba(143,203,255,0.08);
  transform: scale(1.05);
}

.project-slide-dots {
  display: flex;
  gap: 0.5rem;
}

.project-slide-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(143,203,255,0.3);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.project-slide-dot:hover {
  border-color: #8fcbff;
  transform: scale(1.2);
}

.project-slide-dot.active {
  border-color: transparent;
  transform: scale(1.3);
}

@media (max-width: 768px) {
  .project-slide-content { padding: 1.25rem; }
  .project-slide-screenshot { width: 240px; }
}


    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hamburger { display: flex; }

      .hero-inner { grid-template-columns: 1fr; }
      .hero-visual { margin-top: 2rem; }
      .avatar-frame { width: 200px; height: 200px; }
      .badge-3 { display: none; }

      .contact-inner { grid-template-columns: 1fr; }
    }
  `;

  return (
    <>
      <style>{css}</style>

      {/* Cursor Glow */}
      <div className="cursor-glow" style={{ transform: `translate(calc(${mousePos.x}px - 50%), calc(${mousePos.y}px - 50%))` }} />
      <div className="noise" />
      <div className="grid-bg" />

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo" onClick={() => scrollTo("About")}>
          &lt;<span>Mon</span>&gt;
        </div>
        <ul className="nav-links">
          {NAV_LINKS.map((n) => (
            <li key={n} className={activeNav === n ? "active" : ""} onClick={() => scrollTo(n)}>{n}</li>
          ))}
        </ul>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span style={menuOpen ? { transform: "rotate(45deg) translate(5px, 5px)" } : {}} />
          <span style={menuOpen ? { opacity: 0 } : {}} />
          <span style={menuOpen ? { transform: "rotate(-45deg) translate(5px, -5px)" } : {}} />
        </div>
      </nav>

      <ul className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((n) => (
          <li key={n} onClick={() => scrollTo(n)}>{n}</li>
        ))}
      </ul>

      {/* HERO / ABOUT */}
      <section id="about" ref={heroRef}>
        <div className="section-wrap" style={{ paddingTop: "8rem" }}>
          <div className="hero-inner">
            <div>
              <div className={`hero-label${heroInView ? " visible" : ""}`}>
                ◆ Available for hire &nbsp;·&nbsp; Philippines
              </div>
              <h1 className={`hero-name${heroInView ? " visible" : ""}`}>
                Symmon Jared<br />
                <span className="accent">Centeno</span><br />
                Gagaring.
              </h1>
              <div className={`hero-role${heroInView ? " visible" : ""}`}>
                <span className="hero-role-prefix">and I can be a</span>
                <RoleRotator />
              </div>
              <p className={`hero-bio${heroInView ? " visible" : ""}`}>
                I build across the full stack — from React and Node.js web apps to React Native mobile applications, with ASP.NET Core and Spring Boot in my toolkit. Recently, I've been diving into AI engineering, exploring embeddings, semantic search, LLM prompt design, and grounding techniques. I enjoy understanding systems from the ground up and am continuously expanding my skills across cloud, backend architecture, and AI.
              </p>
              <div className={`hero-cta${heroInView ? " visible" : ""}`}>
                <button className="btn-primary" onClick={() => scrollTo("Projects")}>View Projects</button>
                <button className="btn-secondary" onClick={() => scrollTo("Contact")}>Get in Touch</button>
                <a href="/resume-new.pdf" download="resume-new.pdf" className="btn-secondary">
                  Resume
                </a>
            </div>
            </div>
            <div className={`hero-visual${heroInView ? " visible" : ""}`}>
              <div className="avatar-frame">
                <div className="avatar-placeholder">
                  
                  <div className="avatar-text">{<img src={me} alt="Profile" className="w-full h-full object-cover" />}</div>
                </div>
                <div className="floating-badge badge-1">◆ Open to work</div>
                <div className="floating-badge badge-2">⚡ Full-Stack learner</div>
                <div className="floating-badge badge-3">📍 PH</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" ref={skillsRef}>
        <div className="section-wrap">
          <div className={`section-label${skillsInView ? " visible" : ""}`}>Capabilities</div>
          <div className={`section-title${skillsInView ? " visible" : ""}`}>
            Tech<br /><span className="dim">Stack.</span>
          </div>
          <div className="skills-grid">
            {SKILL_GROUPS.map((g, i) => (
              <div
                key={g.group}
                className={`skill-card${skillsInView ? " visible" : ""}`}
                style={{
                  transitionDelay: `${i * 0.09}s`,
                  borderColor: `${g.color}22`,
                  "--group-color": g.color,
                }}
              >
                <div
                  className="skill-card"
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: "2px",
                    background: `linear-gradient(90deg, ${g.color}, transparent)`,
                    border: "none",
                    padding: 0,
                    opacity: 0.7,
                    transform: "none",
                  }}
                />
                <div className="skill-group-header">
                  <span className="skill-group-icon">{g.icon}</span>
                  <span className="skill-group-name">{g.group}</span>
                  <span className="skill-group-count">{g.skills.length} skills</span>
                </div>
                <div className="skill-divider" />
                <div className="skill-pills">
                  {g.skills.map((s) => (
                    <span
                      key={s}
                      className="skill-pill"
                      style={{
                        borderColor: `${g.color}33`,
                        color: g.color,
                        background: `${g.color}08`,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <ProjectsSlider PROJECTS={PROJECTS} projectsRef={projectsRef} projectsInView={projectsInView} />
<MinilangPlayground />
      {/* CONTACT */}
      <section id="contact" ref={contactRef}>
        <div className="section-wrap">
          <div className={`section-label${contactInView ? " visible" : ""}`}>Connect</div>
          <div className={`section-title${contactInView ? " visible" : ""}`}>
            Let's<br /><span className="dim">Talk.</span>
          </div>
          <div className="contact-inner">
            <div>
              <p className={`contact-blurb${contactInView ? " visible" : ""}`}>
                I'm currently looking for opportunities to start my web development career. Whether you have a project in mind, a role that fits, or just want to connect — my inbox is always open.
              </p>
              <div className={`contact-links${contactInView ? " visible" : ""}`}>
                {[
                  { icon: "✉", label: "Email", value: "symmonjaredgagaring@email.com", action: ()=>handleCopy({label: "Email", value: "symmonjaredgagaring@email.com"}) },

                  { icon: "💼", label: "LinkedIn", value: "www.linkedin.com/in/symmon-jared-gagaring-b20a24412", action: () => handleCopy({label: "LinkedIn", value: "www.linkedin.com/in/symmon-jared-gagaring-b20a24412"}) },
                  
                  { icon: "🐙", label: "GitHub", value: "github.com/SyJared", action: () => handleCopy({label: "GitHub", value: "github.com/SyJared"}) },
                ].map((link) => (
                  <div key={link.label} className="contact-link-item" onClick={link.action}>
                    <span className="contact-link-icon">{link.icon}</span>
                    <span className="contact-link-label">{link.label}</span>
                    <span className="contact-link-value overflow-hidden" style={{ maxWidth: "200px", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {copied === link.label ? "Copied!" : link.value}
                    </span>
                    <span className="contact-link-arrow">→</span>
                  </div>
                ))}
              </div>
            </div>
            <form className={`contact-form${contactInView ? " visible" : ""}`} ref={form} onSubmit={sendEmail}>
              <div className="form-group">
                <label className="form-label" >Your Name</label>
                <input className="form-input" type="text" placeholder="Symmon Jared"  name="from_name" required/>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="example@example.com" name="from_email" required />
              </div>
              <input
                type="hidden"
                name="time"
                value={new Date().toLocaleString()}
              />
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" placeholder="Tell me about the opportunity..." name="message" required />
              </div>
              <button className="btn-primary" style={{ width: "100%" }}>
                Send Message →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-name">&lt;Mon /&gt;</div>
        <div className="footer-copy">© 2026 · Built with React · Philippines</div>
      </footer>
    </>
  );
}