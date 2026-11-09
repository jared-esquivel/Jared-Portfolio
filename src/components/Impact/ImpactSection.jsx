import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
    to: "/hackwatsonville",
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
  const content = (
    <>
      <div
        className="panel-image"
        style={{ backgroundImage: `url(${item.image})` }}
      />
      <div className="panel-overlay">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        {item.to && (
          <span className="panel-link-cue" aria-hidden="true">
            Learn more <span>→</span>
          </span>
        )}
      </div>
    </>
  );

  const className = "impact-panel" + (isVisible ? " is-visible" : "");
  const style = {
    transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100}ms`,
  };

  if (item.to) {
    return (
      <Link className={className} style={style} to={item.to}>
        {content}
      </Link>
    );
  }

  return (
    <article className={className} style={style}>
      {content}
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
  const panelGridRef = useRef(null);
  const panelScrollFrameRef = useRef(null);
  const statsReveal = useRevealOnce(0.3);
  const panelsReveal = useRevealOnce(0.15);
  const [activePanel, setActivePanel] = useState(0);

  // Start/stop the firefly canvas exactly once, same lifecycle
  // pattern as your Hero's aurora canvas.
  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = startFireflies(canvasRef.current);
    return cleanup;
  }, []);

  useEffect(
    () => () => cancelAnimationFrame(panelScrollFrameRef.current),
    [],
  );

  function updateActivePanel() {
    const grid = panelGridRef.current;
    if (!grid) return;

    cancelAnimationFrame(panelScrollFrameRef.current);
    panelScrollFrameRef.current = requestAnimationFrame(() => {
      const gridCenter = grid.scrollLeft + grid.clientWidth / 2;
      const panels = Array.from(grid.children);
      let closestIndex = 0;
      let closestDistance = Infinity;

      panels.forEach((panel, index) => {
        const panelCenter = panel.offsetLeft + panel.offsetWidth / 2;
        const distance = Math.abs(panelCenter - gridCenter);
        if (distance < closestDistance) {
          closestIndex = index;
          closestDistance = distance;
        }
      });

      setActivePanel(closestIndex);
    });
  }

  function scrollToPanel(index) {
    const grid = panelGridRef.current;
    const panel = grid?.children[index];
    if (!grid || !panel) return;

    const centeredLeft =
      panel.offsetLeft - (grid.clientWidth - panel.offsetWidth) / 2;
    grid.scrollTo({
      left: centeredLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    setActivePanel(index);
  }

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
              <button
                type="button"
                onClick={() => {
                  document.getElementById("impact-content")?.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "start",
                  });
                }}
              >
                See My Impact <span>→</span>
              </button>
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
        <div className="panels-shell" id="impact-content">
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
              <button
                type="button"
                onClick={() => {
                  document.getElementById("experience")?.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "start",
                  });
                }}
              >
                Explore the Journey
              </button>
            </div>
          </div>

          <div
            className="panel-grid"
            ref={(node) => {
              panelGridRef.current = node;
              panelsReveal.ref.current = node;
            }}
            onScroll={updateActivePanel}
          >
            {INITIATIVES.map((item, index) => (
              <InitiativePanel
                key={item.id}
                item={item}
                index={index}
                isVisible={panelsReveal.isVisible}
              />
            ))}
          </div>

          <div
            className="panel-carousel-controls"
            aria-label="Impact panel navigation"
          >
            <button
              type="button"
              className="panel-carousel-arrow"
              aria-label="Previous impact panel"
              disabled={activePanel === 0}
              onClick={() => scrollToPanel(activePanel - 1)}
            >
              ←
            </button>

            <div className="panel-carousel-dots">
              {INITIATIVES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    "panel-carousel-dot" +
                    (activePanel === index ? " is-active" : "")
                  }
                  aria-label={`Show ${item.title} panel`}
                  aria-current={activePanel === index ? "true" : undefined}
                  onClick={() => scrollToPanel(index)}
                >
                  <span />
                </button>
              ))}
            </div>

            <button
              type="button"
              className="panel-carousel-arrow"
              aria-label="Next impact panel"
              disabled={activePanel === INITIATIVES.length - 1}
              onClick={() => scrollToPanel(activePanel + 1)}
            >
              →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
