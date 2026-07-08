import { useEffect, useRef } from "react";
import AtomicModel from "./AtomicModel";
import { startHeroBackground } from "./heroBackground.js";
import "./ProjectsHero.css";

export default function ProjectsHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = startHeroBackground(canvasRef.current);
    return cleanup;
  }, []);

  return (
    <section className="projects-hero">
      <canvas
        ref={canvasRef}
        className="projects-hero-canvas"
        aria-hidden="true"
      />

      <div className="projects-hero-shell">
        <div className="projects-hero-text">
          <p className="projects-hero-eyebrow">Selected Work</p>

          <h1 className="projects-hero-heading">Projects</h1>

          <p className="projects-hero-paragraph">
            A collection of software, leadership, and engineering projects that
            challenged me to learn, build, and create solutions with real-world
            impact.
          </p>

          <a href="#software" className="projects-hero-cta">
            Explore Projects
          </a>
        </div>

        <div className="projects-hero-visual">
          <AtomicModel />
        </div>
      </div>
    </section>
  );
}
