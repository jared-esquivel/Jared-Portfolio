import { useEffect, useRef, useState } from "react";
import { startFireflies } from "./fireflyCanvas.js";
import "./ImpactSection.css";
import hackImg from "../../assets/HackWatsonville-logo.png";
import panelsImg from "../../assets/Logo-Adobe.png";
import workshopImg from "../../assets/think-first.png";

// ---------- Data ----------
// Add a stat or initiative later by adding one object here — no
// markup changes needed anywhere else.
const IMPACT_STATS = [
  {
    id: "students",
    icon: "👥",
    value: 150,
    suffix: "+",
    label:
      "Students reached through events, panels, leadership roles and workshops.",
    accent: "",
  },
  {
    id: "panels",
    icon: "🎙️",
    value: 8,
    suffix: "",
    label: "Industry panels, workshops, and speaking engagements hosted.",
    accent: "purple",
  },
  {
    id: "initiatives",
    icon: "💡",
    value: 5,
    suffix: "+",
    label: "Industry Partnerships Established.",
    accent: "green",
  },
];

const INITIATIVES = [
  {
    id: "hackwatsonville",
    title: "HackWatsonville",
    description:
      "Founded a student hackathon for creativity, access, and community impact.",
    image: hackImg,
  },
  {
    id: "engineering-panels",
    title: "Engineering Panels",
    description:
      "Connected students with engineers from Adobe, Joby Aviation, and local leaders.",
    image: panelsImg,
  },
  {
    id: "ai-workshops",
    title: "AI Workshops",
    description:
      "Created learning experiences around ethical AI, mathematics support, and confidence.",
    image: workshopImg,
  },
];

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ---------- One stat card, with its own count-up state ----------
function StatCard({ stat, index, isVisible }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    if (prefersReducedMotion) {
      setCount(stat.value);
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(progress);
      setCount(Math.round(stat.value * eased));

      if (progress < 1) requestAnimationFrame(tick);
      else setCount(stat.value); // guarantee exact final value
    }

    requestAnimationFrame(tick);
  }, [isVisible, stat.value]);

  return (
    <article
      className={"stat-card" + (isVisible ? " is-visible" : "")}
      style={{
        transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100}ms`,
      }}
    >
      <div className={"icon" + (stat.accent ? ` ${stat.accent}` : "")}>
        {stat.icon}
      </div>
      <h2>
        {count}
        {stat.suffix}
      </h2>
      <p>{stat.label}</p>
    </article>
  );
}

// ---------- One initiative panel ----------
function InitiativePanel({ item, index, isVisible }) {
  return (
    <article
      className={"impact-panel" + (isVisible ? " is-visible" : "")}
      style={{
        transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100}ms`,
      }}
    >
      <div
        className="panel-image"
        style={{ backgroundImage: `url(${item.image})` }}
      />
      <div className="panel-overlay">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

// Small reusable hook: fires once when the referenced element first
// enters the viewport, then stops observing.
function useRevealOnce(threshold = 0.2) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export default function ImpactSection() {
  const canvasRef = useRef(null);
  const statsReveal = useRevealOnce(0.3);
  const panelsReveal = useRevealOnce(0.15);

  // Start/stop the firefly canvas exactly once, same lifecycle
  // pattern as your Hero's aurora canvas.
  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = startFireflies(canvasRef.current);
    return cleanup;
  }, []);

  return (
    <>
      <section className="impact-section" id="impact">
        <canvas ref={canvasRef} id="firefliesCanvas" />

        <div className="impact-shell">
          <header className="impact-header">
            <h1>Real Projects. Real Impact.</h1>

            <div className="impact-intro">
              <p>
                Leadership, community events, and student-centered initiatives
                that create real opportunities.
              </p>
              <a href="#impact-panels">
                See My Impact <span>→</span>
              </a>
            </div>

            <div className="impact-stats" ref={statsReveal.ref}>
              {IMPACT_STATS.map((stat, index) => (
                <StatCard
                  key={stat.id}
                  stat={stat}
                  index={index}
                  isVisible={statsReveal.isVisible}
                />
              ))}
            </div>
          </header>
        </div>
      </section>

      <section className="impact-panels" id="impact-panels">
        <div className="panels-shell">
          <div className="panels-top">
            <h2>
              Turning Ideas
              <br />
              Into Reality.
            </h2>

            <div>
              <p>
                Start with curiosity.
                <br />
                Leave with community and opportunity.
              </p>
              <a href="#experience">Explore the Journey</a>
            </div>
          </div>

          <div className="panel-grid" ref={panelsReveal.ref}>
            {INITIATIVES.map((item, index) => (
              <InitiativePanel
                key={item.id}
                item={item}
                index={index}
                isVisible={panelsReveal.isVisible}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
