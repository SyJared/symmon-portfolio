import { useState, useEffect, useRef } from "react";
import './index.css'
import me from '/me.png'
import emailjs from "@emailjs/browser";


const NAV_LINKS = ["About", "Skills", "Projects", "Contact"];

const SKILL_GROUPS = [
  {
    group: "Frontend",
    color: "#00e5ff",
    icon: "🖥",
    skills: ["React", "React Router", "JavaScript", "HTML", "CSS"],
  },
  {
    group: "Backend",
    color: "#a78bfa",
    icon: "⚙️",
    skills: ["Node.js", "Express.js", "REST APIs", "JWT Authentication"],
  },
  {
    group: "Database",
    color: "#34d399",
    icon: "🗄",
    skills: ["MySQL", "SQL"],
  },
  {
    group: "Tools",
    color: "#f59e0b",
    icon: "🛠",
    skills: ["Git", "GitHub", "Docker(basic)", "Linux(basic)"],
  },
  {
    group: "Other",
    color: "#f472b6",
    icon: "✦",
    skills: ["Zod Validation", "bcrypt", "Middleware", "Role-Based Access"],
  },
];

const PROJECTS = [
  {
    title: "DigiBarangay",
    tag: "Civic Tech",
    year: "2025",
    description: "A platform that streamlines barangay services — featuring a community bulletin board, real-time notifications, online document request system, and improved management of community records.",
    stack: ["React", "PHP", "MySQL"],
    color: "#00e5ff",
    icon: "🏛️",
    github: "https://github.com/SyJared/digibaranggay"
    
  },
  {
    title: "Flow",
    tag: "Productivity",
    year: "2026",
    description: "An online web-based workspace built for any kind of work. Offers multiple workspaces and task boards, where each task can be assigned to a specific team member.",
    stack: ["React", "Express.js", "Node.js"],
    color: "#a78bfa",
    icon: "⚡",
    github: "https://github.com/SyJared/flow",
    demo: "https://flow-demo-gold.vercel.app"
  }
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
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #090b10; color: #e8eaf0; font-family: 'DM Mono', monospace; overflow-x: hidden; margin-top: -5rem; }
    ::selection { background: #00e5ff33; color: #00e5ff; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #090b10; }
    ::-webkit-scrollbar-thumb { background: #00e5ff44; border-radius: 2px; }

    .cursor-glow {
      position: fixed;
      top: 0; left: 0;
      width: 400px; height: 400px;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%);
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
  background: #0e1117;
  border: 0.5px solid #00e5ff33;
  border-radius: 8px;
  padding: 12px 18px;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: #e8eaf0;
  min-width: 240px;
  z-index: 9999;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
  pointer-events: none;
  overflow: hidden;
}
.toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
.toast.success .toast-icon { color: #00e5ff; }
.toast.error .toast-icon { color: #ff5470; }
.toast.error { border-color: #ff547033; }
.toast-icon { font-size: 16px; flex-shrink: 0; }
.toast-msg span { display: block; font-size: 11px; color: #6b7280; margin-top: 2px; }
.toast-bar {
  position: absolute;
  bottom: 0; left: 0;
  height: 2px;
  width: 100%;
  background: #00e5ff55;
  transform-origin: left;
  transform: scaleX(1);
}
.toast.error .toast-bar { background: #ff547055; }

    .noise {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    .grid-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
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
      background: rgba(9,11,16,0.92);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(0,229,255,0.08);
    }

    .nav-logo {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.3rem;
      color: #fff;
      cursor: pointer;
      letter-spacing: -0.02em;
    }
    .nav-logo span { color: #00e5ff; }

    .nav-links { display: flex; gap: 2.5rem; list-style: none; }
    .nav-links li {
      font-size: 0.72rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      cursor: pointer;
      color: #8892a4;
      transition: color 0.2s;
      position: relative;
      padding-bottom: 2px;
    }
    .nav-links li::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 0; height: 1px;
      background: #00e5ff;
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
      background: #e8eaf0;
      transition: all 0.3s ease;
    }

    .mobile-menu {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 150;
      background: rgba(9,11,16,0.97);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
    }
    .mobile-menu.open { display: flex; }
    .mobile-menu li {
      font-family: 'Syne', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      list-style: none;
      cursor: pointer;
      color: #e8eaf0;
      letter-spacing: -0.02em;
      transition: color 0.2s;
    }
    .mobile-menu li:hover { color: #00e5ff; }

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
      color: #00e5ff;
      margin-bottom: 1.2rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.8s ease;
    }
    .hero-label.visible { opacity: 1; transform: translateY(0); }

    .hero-name {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: clamp(3rem, 3vw, 5.5rem);
      line-height: 0.95;
      letter-spacing: -0.03em;
      color: #fff;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.9s ease 0.1s;
    }
    .hero-name.visible { opacity: 1; transform: translateY(0); }
    .hero-name .accent { color: #00e5ff; }

    .hero-role {
      font-size: 0.8rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #8892a4;
      margin-top: 1.2rem;
      margin-bottom: 1.8rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.8s ease 0.2s;
    }
    .hero-role.visible { opacity: 1; transform: translateY(0); }

    .hero-bio {
      font-size: 0.88rem;
      line-height: 1.8;
      color: #8892a4;
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

    .btn-primary {
      padding: 0.75rem 2rem;
      background: #00e5ff;
      color: #090b10;
      font-family: 'DM Mono', monospace;
      font-size: 0.72rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
    }
    .btn-primary:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,229,255,0.3); }

    .btn-secondary {
      padding: 0.75rem 2rem;
      background: transparent;
      color: #e8eaf0;
      font-family: 'DM Mono', monospace;
      font-size: 0.72rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border: 1px solid rgba(255,255,255,0.15);
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: #00e5ff; color: #00e5ff; transform: translateY(-2px); }
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

    .avatar-frame {
      position: relative;
      width: 280px;
      height: 280px;
    }
    .avatar-frame::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, #00e5ff, #a78bfa, #090b10, #090b10);
      z-index: -1;
    }
    .avatar-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #111520, #1a1f2e);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .avatar-icon { font-size: 4rem; }
    .avatar-text { font-size: 0.65rem; letter-spacing: 0.15em; color: #8892a4; text-transform: uppercase; }

    .floating-badge {
      position: absolute;
      background: rgba(9,11,16,0.9);
      border: 1px solid rgba(0,229,255,0.2);
      padding: 0.6rem 1rem;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      white-space: nowrap;
    }
    .badge-1 { top: -16px; right: -24px; color: #00e5ff; }
    .badge-2 { bottom: -16px; left: -24px; color: #a78bfa; border-color: rgba(167,139,250,0.2); }
    .badge-3 { top: 50%; left: -60px; transform: translateY(-50%); color: #8892a4; border-color: rgba(255,255,255,0.1); }

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
      color: #00e5ff;
      margin-bottom: 0.5rem;
      opacity: 0;
      transform: translateY(16px);
      transition: all 0.6s ease;
    }
    .section-label.visible { opacity: 1; transform: translateY(0); }

    .section-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(2rem, 3.5vw, 3.2rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
      color: #fff;
      margin-bottom: 3.5rem;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.7s ease 0.1s;
    }
    .section-title.visible { opacity: 1; transform: translateY(0); }
    .section-title .dim { color: #00e5ff; }

    /* SKILLS */
    #skills { background: rgba(255,255,255,0.01); }
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .skill-card {
      border: 1px solid rgba(255,255,255,0.06);
      padding: 1.6rem;
      background: rgba(255,255,255,0.02);
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
      opacity: 0.7;
    }
    .skill-card.visible { opacity: 1; transform: translateY(0); }
    .skill-card:hover {
      transform: translateY(-4px);
      background: rgba(255,255,255,0.03);
    }
    .skill-group-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.2rem;
    }
    .skill-group-icon { font-size: 1.2rem; }
    .skill-group-name {
      font-family: 'Syne', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.01em;
    }
    .skill-group-count {
      margin-left: auto;
      font-size: 0.62rem;
      letter-spacing: 0.12em;
      color: #3a4255;
    }
    .skill-divider {
      height: 1px;
      background: rgba(255,255,255,0.05);
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

  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);

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
  border-color: rgba(255,255,255,0.12);
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
  color: #8892a4;
  margin-top: 0.4rem;
}


.project-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  margin-bottom: 0.55rem;
}

.project-desc {
  font-size: 0.82rem;
  line-height: 1.5;
  color: #8892a4;
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
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #8892a4;
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

  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  color: #8892a4;

  backdrop-filter: blur(6px);

  cursor: pointer;


  transform: translateY(-6px);
   pointer-events: auto;

  transition: all 0.25s ease;
}



.project-github-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(255,255,255,0.2);
  color: #fff;
  background: rgba(255,255,255,0.05);
}

.project-hover-hint {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.35);

  opacity: 0;
  transform: translateY(6px);
  transition: all 0.25s ease;
}

.project-card:hover .project-hover-hint {
  opacity: 1;
  transform: translateY(0);
  color: rgba(255, 255, 255, 0.7);
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

  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  color: #8892a4;
opacity: 0;
  transform: translateY(6px);
  pointer-events: auto;

  transition: all 0.25s ease;
}
  .project-cta:hover {
  cursor: pointer;
  transform: translateY(-2px);
  color: #fff;
  border-color: rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.06);
}

.project-card:hover .project-cta {
  cursor: pointer;
  transform: translateY(6px);

  opacity: 1;

}

    /* CONTACT */
    #contact { background: rgba(255,255,255,0.01); }
    .contact-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }
    .contact-blurb {
      font-size: 0.88rem;
      line-height: 1.8;
      color: #8892a4;
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
      border: 1px solid rgba(255,255,255,0.06);
      cursor: pointer;
      transition: all 0.2s;
    }
    .contact-link-item:hover {
      border-color: rgba(0,229,255,0.25);
      background: rgba(0,229,255,0.03);
    }
    .contact-link-icon { font-size: 1.1rem; }
    .contact-link-label { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: #8892a4; flex: 1; }
    .contact-link-value { font-size: 0.78rem; color: #e8eaf0; }
    .contact-link-arrow { color: #00e5ff; font-size: 0.8rem; }

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
      color: #8892a4;
      margin-bottom: 0.5rem;
    }
    .form-input, .form-textarea {
      width: 100%;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 0.85rem 1rem;
      color: #e8eaf0;
      font-family: 'DM Mono', monospace;
      font-size: 0.82rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-input:focus, .form-textarea:focus { border-color: rgba(0,229,255,0.4); }
    .form-textarea { resize: vertical; min-height: 120px; }
    ::placeholder { color: #3a4255; }

    /* FOOTER */
    footer {
      border-top: 1px solid rgba(255,255,255,0.05);
      padding: 2rem 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .footer-name {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 0.9rem;
      color: #fff;
    }
    .footer-copy { font-size: 0.7rem; color: #3a4255; }

    @media (max-width: 768px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }

  .hero-inner { grid-template-columns: 1fr; }
  .hero-visual { margin-top: 2rem; }
  .avatar-frame { width: 200px; height: 200px; }
  .badge-3 { display: none; }

  .contact-inner { grid-template-columns: 1fr; }

 

  
}
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
                ◆ Available for hire
              </div>
              <h1 className={`hero-name${heroInView ? " visible" : ""}`}>
                Symmon Jared<br />
                <span className="accent">Centeno</span><br />
                Gagaring.
              </h1>
              <div className={`hero-role${heroInView ? " visible" : ""}`}>
                Aspiring Web Developer &nbsp;·&nbsp; Philippines
              </div>
              <p className={`hero-bio${heroInView ? " visible" : ""}`}>
                I'm a 22-year-old aspiring web developer eager to launch my career in building things for the web. Through project studies and continuous learning, I've developed a solid foundation across the full stack — and a genuine love for problem solving.
              </p>
              <div className={`hero-cta${heroInView ? " visible" : ""}`}>
                <button className="btn-primary" onClick={() => scrollTo("Projects")}>View Projects</button>
                <button className="btn-secondary" onClick={() => scrollTo("Contact")}>Get in Touch</button>
                <a href="/resume.docx" download="resume.docx" className="btn-secondary">
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
          <div className={`section-label${skillsInView ? " visible" : ""}`}>02 — Capabilities</div>
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
      <section id="projects" ref={projectsRef}>
        <div className="section-wrap">
          <div className={`section-label${projectsInView ? " visible" : ""}`}>03 — Work</div>
          <div className={`section-title${projectsInView ? " visible" : ""}`}>
            Featured<br /><span className="dim">Projects.</span>
          </div>
          <div className="projects-grid">
        {PROJECTS.map((p, i) => (
          <div className={`project-card${projectsInView ? " visible" : ""}`}
            style={{
              transitionDelay: `${i * 0.15}s`,
              "--card-color": p.color
            }}
          >
  <div className="project-card-header">
    <div className="project-icon">{p.icon}</div>

    <div className="project-meta">
      <span
        className="project-tag"
        style={{ borderColor: `${p.color}44`, color: p.color }}
      >
        {p.tag}
      </span>

      <div className="project-year">{p.year}</div>
    </div>

    <button
      className="project-github-btn"
      onClick={(e) => {
        e.stopPropagation();
        window.open(p.github, "_blank", "noopener,noreferrer");
      }}
      aria-label="Open GitHub"
    >
      ⟡
    </button>
  </div>

  <div className="project-title">{p.title}</div>
  <p className="project-desc">{p.description}</p>

 <div className="project-stack">
  {p.stack.map((t) => (
    <span key={t} className="stack-tag">{t}</span>
  ))}
</div>

<div className="project-footer">
  <button
    className="project-cta"
    onClick={(e) => {
  e.stopPropagation();
  window.open(p.demo || p.github, "_blank", "noopener,noreferrer");
}}
  >
    View Demo →
  </button>
</div>
  

  <div className="project-glow" style={{ background: p.color }} />

  <div
    className="card-line"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background: `linear-gradient(90deg, ${p.color}, transparent)`,
      opacity: 0,
      transition: "opacity 0.3s"
    }}
  />
 
</div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" ref={contactRef}>
        <div className="section-wrap">
          <div className={`section-label${contactInView ? " visible" : ""}`}>04 — Connect</div>
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