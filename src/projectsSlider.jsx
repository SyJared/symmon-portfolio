import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function ProjectsSlider({ PROJECTS, projectsRef, projectsInView }) {
    const [current, setCurrent] = useState(0);
    const [modalIndex, setModalIndex] = useState(null); // null = closed, else index into current project's screenshots

    const goNext = () => setCurrent((prev) => (prev + 1) % PROJECTS.length);
    const goPrev = () => setCurrent((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);

    const p = PROJECTS[current];

    const openModal = (i) => setModalIndex(i);
    const closeModal = () => setModalIndex(null);
    const modalNext = () => setModalIndex((i) => (i + 1) % p.screenshots.length);
    const modalPrev = () => setModalIndex((i) => (i - 1 + p.screenshots.length) % p.screenshots.length);

    useEffect(() => {
        setModalIndex(null);
    }, [current]);

    useEffect(() => {
        const handleKey = (e) => {
            // While the modal is open, arrow/escape keys control the modal,
            // not the project slider underneath it -- otherwise pressing
            // ArrowRight to see the next screenshot would also silently
            // jump you to the next project in the background.
            if (modalIndex !== null) {
                if (e.key === "Escape") closeModal();
                if (e.key === "ArrowRight") modalNext();
                if (e.key === "ArrowLeft") modalPrev();
                return;
            }
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [modalIndex, p]);

    return (
        <section id="projects" ref={projectsRef} className="projects-slide-section">
            <div className="projects-slide-glow" style={{ background: p.color }} />

            <div className="section-wrap projects-slide-wrap">
                <div className={`section-label${projectsInView ? " visible" : ""}`}>Work</div>
                <div className={`section-title${projectsInView ? " visible" : ""}`}>
                    Featured<br /><span className="dim">Projects.</span>
                </div>

                <div className="project-slide-counter">
                    {String(current + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                </div>

                <div className="project-slide-content" key={p.title}>
                    <div className={`project-slide-body${p.screenshots?.length > 0 ? " has-media" : ""}`}>
                        <div className="project-slide-info">
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
                                    onClick={() => window.open(p.github, "_blank", "noopener,noreferrer")}
                                    aria-label="Open GitHub"
                                >
                                    ⟡
                                </button>
                            </div>

                            <div className="project-slide-title">{p.title}</div>
                            <p className="project-slide-desc">{p.description}</p>

                            <div className="project-stack">
                                {p.stack.map((t) => (
                                    <span key={t} className="stack-tag">{t}</span>
                                ))}
                            </div>

                            <div className="project-footer">
                                <button
                                    className="project-cta"
                                    onClick={() => window.open(p.demo || p.github, "_blank", "noopener,noreferrer")}
                                >
                                    {p.demo ? "View Demo →" : "View Code →"}
                                </button>
                            </div>
                        </div>

                        {p.screenshots?.length > 0 && (
                            <div className="project-slide-screenshots">
                                {p.screenshots.map((src, i) => (
                                    <div
                                        className="project-slide-screenshot"
                                        key={i}
                                        onClick={() => openModal(i)}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`View ${p.title} screenshot ${i + 1} full size`}
                                    >
                                        <img src={src} alt={`${p.title} screenshot ${i + 1}`} />
                                        <div className="screenshot-zoom-hint">⤢</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {modalIndex !== null && createPortal(
                    <div className="screenshot-modal" onClick={closeModal}>
                        <button className="screenshot-modal-close" onClick={closeModal} aria-label="Close">
                            ✕
                        </button>

                        {p.screenshots.length > 1 && (
                            <button
                                className="screenshot-modal-arrow left"
                                onClick={(e) => { e.stopPropagation(); modalPrev(); }}
                                aria-label="Previous screenshot"
                            >
                                ‹
                            </button>
                        )}

                        <img
                            src={p.screenshots[modalIndex]}
                            alt={`${p.title} screenshot ${modalIndex + 1}`}
                            className="screenshot-modal-img"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {p.screenshots.length > 1 && (
                            <button
                                className="screenshot-modal-arrow right"
                                onClick={(e) => { e.stopPropagation(); modalNext(); }}
                                aria-label="Next screenshot"
                            >
                                ›
                            </button>
                        )}

                        <div className="screenshot-modal-counter">
                            {modalIndex + 1} / {p.screenshots.length}
                        </div>
                    </div>,
                    document.body
                )}

                <div className="project-slide-nav">
                    <button className="project-slide-arrow" onClick={goPrev} aria-label="Previous project">‹</button>

                    <div className="project-slide-dots">
                        {PROJECTS.map((proj, i) => (
                            <button
                                key={proj.title}
                                className={`project-slide-dot${i === current ? " active" : ""}`}
                                onClick={() => setCurrent(i)}
                                style={i === current ? { background: proj.color } : {}}
                            />
                        ))}
                    </div>

                    <button className="project-slide-arrow" onClick={goNext} aria-label="Next project">›</button>
                </div>
            </div>
        </section>
    );
}

export default ProjectsSlider;