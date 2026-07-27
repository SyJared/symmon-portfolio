import { useState, useCallback, useRef, useEffect } from "react";

const API_URL = "https://symlang-api.onrender.com/run";

// Local copy of the same fade-in-on-scroll pattern used elsewhere in the portfolio,
// so this section reveals itself the same way About/Skills/Projects/Contact do.
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

const EXAMPLES = {
  Recursion: `function factorial(n) {
  if (n <= 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

print("5! =", factorial(5));
print("7! =", factorial(7));`,

  Loops: `let i = 0;
let sum = 0;

while (i < 10) {
  sum = sum + i;
  i = i + 1;
}

print("sum 0..9 =", sum);`,

  Arrays: `let nums = [4, 8, 15, 16, 23, 42];
let total = 0;
let i = 0;

while (i < length(nums)) {
  total = total + nums[i];
  i = i + 1;
}

print("array:", nums);
print("total:", total);`,

  Strings: `let name = "world";
let greeting = "hello, " + name + "!";

print(greeting);
print("length is", length(greeting));`,
};

const DEFAULT_EXAMPLE = "Recursion";

export default function MiniLangPlayground() {
  const [code, setCode] = useState(EXAMPLES[DEFAULT_EXAMPLE]);
  const [result, setResult] = useState({ output: [], error: null });
  const [running, setRunning] = useState(false);
  const [wakingUp, setWakingUp] = useState(false);
  const [activeExample, setActiveExample] = useState(DEFAULT_EXAMPLE);
  const [sectionRef, sectionInView] = useInView(0.1);

  const runCode = useCallback(async (source) => {
    setRunning(true);
    setWakingUp(false);

    // The free-tier server can take 30-50s to wake up after being idle.
    // Only show the "waking up" message if we're actually waiting that long —
    // a normal warm request (usually well under a second) never sees this.
    const wakeTimer = setTimeout(() => setWakingUp(true), 4000);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: source }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setResult({ output: data.output || [], error: data.error || null });
    } catch (err) {
      setResult({
        output: [],
        error: `Could not reach the MiniLang server: ${err.message}`,
      });
    } finally {
      clearTimeout(wakeTimer);
      setWakingUp(false);
      setRunning(false);
    }
  }, []);

  const handleRun = () => runCode(code);

  const handleExample = (name) => {
    setActiveExample(name);
    setCode(EXAMPLES[name]);
    setResult({ output: [], error: null });
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
    // Basic tab support inside the textarea
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newValue = code.slice(0, start) + "  " + code.slice(end);
      setCode(newValue);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  };

  return (
    <section id="playground" ref={sectionRef}>
      <style>{CSS}</style>
      <div className="section-wrap">
        <div className={`section-label${sectionInView ? " visible" : ""}`}>◆ Live Demo</div>
        <div className={`section-title${sectionInView ? " visible" : ""}`}>
          MiniLang<br /><span className="dim">Playground.</span>
        </div>
        <p className={`ml-blurb${sectionInView ? " visible" : ""}`}>
          A tiny programming language I built from scratch in Java — lexer, parser, and
          tree-walking interpreter, no libraries. This runs on a real Spring Boot API
          hitting my actual interpreter. Edit the code and hit run.
          
        </p>
        
        <div className={`ml-examples${sectionInView ? " visible" : ""}`}>
          <p className={`ml-blurb${sectionInView ? " visible" : ""}`}>EXAMPLES:</p>
          {Object.keys(EXAMPLES).map((name) => (
            <button
              key={name}
              className={`ml-example-btn${activeExample === name ? " active" : ""}`}
              onClick={() => handleExample(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className={`ml-panels${sectionInView ? " visible" : ""}`}>
          <div className="ml-panel">
            <div className="ml-panel-chrome">
              <span className="ml-dot ml-dot-red" />
              <span className="ml-dot ml-dot-yellow" />
              <span className="ml-dot ml-dot-green" />
              <span className="ml-panel-name">main.mini</span>
            </div>
            <textarea
              className="ml-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

          <div className="ml-panel">
            <div className="ml-panel-chrome">
              <span className="ml-panel-name">output</span>
              <button className="ml-run-btn" onClick={handleRun} disabled={running}>
                {running ? "Running…" : "▶ Run"}
                <span className="ml-run-hint">⌘⏎</span>
              </button>
            </div>
            <div className="ml-output">
              {result.output.length === 0 && !result.error && (
                <div className="ml-placeholder">// print() output will show up here</div>
              )}
              {result.output.map((line, i) => (
                <div key={i} className="ml-line">
                  <span className="ml-arrow">›</span> {line}
                </div>
              ))}
              {result.error && (
                <div className="ml-error">
                  <span className="ml-arrow">✕</span> {result.error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

#playground .ml-blurb {
  font-size: 0.88rem;
  line-height: 1.8;
  color: #8892a4;
  max-width: 640px;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.2s;
  font-family: 'DM Mono', monospace;
}
#playground .ml-blurb.visible { opacity: 1; transform: translateY(0); }

#playground .ml-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.3s;
}
#playground .ml-examples.visible { opacity: 1; transform: translateY(0); }

#playground .ml-example-btn {
  font-family: 'DM Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.45rem 1rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.02);
  color: #8892a4;
  cursor: pointer;
  transition: all 0.2s ease;
}

#playground .ml-example-btn:hover {
  color: #e8eaf0;
  border-color: rgba(255,255,255,0.25);
}

#playground .ml-example-btn.active {
  color: #00e5ff;
  border-color: rgba(0,229,255,0.4);
  background: rgba(0,229,255,0.06);
}

#playground .ml-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  opacity: 0;
  transform: translateY(24px);
  transition: all 0.8s ease 0.4s;
}
#playground .ml-panels.visible { opacity: 1; transform: translateY(0); }

@media (max-width: 860px) {
  #playground .ml-panels {
    grid-template-columns: 1fr;
  }
}

#playground .ml-panel {
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s ease;
}

#playground .ml-panel:hover {
  border-color: rgba(255,255,255,0.12);
}

#playground .ml-panel-chrome {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.2);
}

#playground .ml-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  opacity: 0.5;
}
#playground .ml-dot-red { background: #ff5f56; }
#playground .ml-dot-yellow { background: #ffbd2e; }
#playground .ml-dot-green { background: #27c93f; }

#playground .ml-panel-name {
  font-family: 'DM Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8892a4;
  margin-left: 0.35rem;
}

#playground .ml-run-btn {
  margin-left: auto;
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 0.4rem 0.9rem;
  border: none;
  background: #00e5ff;
  color: #090b10;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
}

#playground .ml-run-btn:hover:not(:disabled) {
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,229,255,0.3);
}

#playground .ml-run-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

#playground .ml-run-hint {
  font-size: 0.62rem;
  opacity: 0.6;
}

#playground .ml-editor {
  flex: 1;
  min-height: 320px;
  resize: vertical;
  border: none;
  outline: none;
  background: transparent;
  color: #e8eaf0;
  font-family: 'DM Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
  padding: 1.1rem;
  tab-size: 2;
}

#playground .ml-output {
  flex: 1;
  min-height: 320px;
  padding: 1.1rem;
  font-family: 'DM Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.8;
  overflow-y: auto;
  color: #e8eaf0;
}

#playground .ml-placeholder {
  opacity: 0.35;
  font-style: italic;
  color: #8892a4;
}

#playground .ml-line {
  color: #00e5ff;
}

#playground .ml-error {
  color: #ff5470;
}

#playground .ml-arrow {
  opacity: 0.5;
  margin-right: 0.4rem;
}
`;