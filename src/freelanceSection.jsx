// "Open to freelance" section. Styles live in the css string in
// Portfolio.jsx (same pattern as ProjectsSlider / RoleRotator).

const SERVICES = [
  {
    icon: "🖥",
    title: "Web Apps",
    desc: "Responsive full-stack web apps and dashboards with React, Node.js and Express.",
  },
  {
    icon: "📱",
    title: "Mobile Apps",
    desc: "Cross-platform iOS and Android apps built with React Native and Expo.",
  },
  {
    icon: "⚙️",
    title: "Backend & APIs",
    desc: "REST APIs, auth and real-time features with Spring Boot or ASP.NET Core.",
  },
  {
    icon: "🧠",
    title: "AI Integration",
    desc: "RAG pipelines, semantic search and LLM features grounded in your own data.",
  },
];

const DETAILS = [
  { label: "Availability", value: "Taking on new projects" },
  { label: "Engagement", value: "Fixed-scope or hourly" },
  { label: "Timezone", value: "PH (UTC+8) · remote-friendly" },
  { label: "Response time", value: "Within 24 hours" },
];

export default function FreelanceSection({ freelanceRef, freelanceInView, onContact }) {
  const v = freelanceInView ? " visible" : "";

  return (
    <section id="freelance" ref={freelanceRef}>
      <div className="section-wrap">
        <div className={`section-label${v}`}>Freelance</div>
        <div className={`section-title${v}`}>
          Open to<br /><span className="dim">Freelance.</span>
        </div>

        <div className="freelance-inner">
          <div className={`freelance-intro${v}`}>
            <div className="freelance-status">
              <span className="freelance-dot" aria-hidden="true" />
              Available for new projects
            </div>
            <p className="freelance-blurb">
              Have an idea, an MVP to ship, or a product that needs another pair of hands?
              I take on freelance work end to end, from planning and building to deployment,
              and I communicate clearly along the way.
            </p>
            <dl className="freelance-details">
              {DETAILS.map((d) => (
                <div key={d.label} className="freelance-detail-row">
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
            <button className="btn-primary" onClick={onContact}>
              Start a Project →
            </button>
          </div>

          <div className="freelance-services">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className={`freelance-card${v}`}
                style={{ transitionDelay: `${0.15 + i * 0.09}s` }}
              >
                <span className="freelance-card-icon">{s.icon}</span>
                <h3 className="freelance-card-title">{s.title}</h3>
                <p className="freelance-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}