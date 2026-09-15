import { useState } from "react";
import NightSky from "../NightSky/NightSky";
import "./SoftwareDevelopmentSection.css";
import promptUsImg from "../../assets/prompt-us-pizzeria.png";
import portfolioImg from "../../assets/Port-hero.png";
import thinkFirstImg from "../../assets/think-first.png";
import digitalNestImg from "../../assets/digital-nest.png";
import Honors from "../../assets/Honors.png";
import Hack from "../../assets/HackWatsonville.png";
import Terminal from "../../assets/terminal.png";
import Island from "../../assets/Island.png";

// ---------- Data ----------
// Add a project later by adding one object here — carousel, preview
// tiles, and dots all render from this array automatically.
const PROJECTS = [
  {
    id: "digital-nest-pages",
    title: "Digital NEST Website",
    type: "WordPress",
    description:
      "WordPress development for Digital NEST's new website, including content migration and accessibility.",
    tech: ["WordPress", "SEO", "Accessibility"],
    liveUrl: "https://digitalnest.org",
    githubUrl: "",
    image: digitalNestImg,
  },
  {
    id: "ai-math-workshop",
    title: "AI Math Workshop",
    type: "Workshop",
    description:
      "A student-centered learning experience that helps students use AI ethically for math support.",
    tech: ["React", "Tailwind.CSS", "JS"],
    liveUrl: "https://jared-esquivel.github.io/Think-First-AI-Studio/",
    image: thinkFirstImg,
  },
  {
    id: "prompt-us-pizzeria",
    title: "Prompt Us Pizzeria",
    type: "Web App",
    description:
      "Interactive personal identifiable information training tool for nonprofits, equipping users to recognize and secure sensitive personal data,",
    tech: ["React", "Phaser 3", "JavaScript", "Tailwind.css"],
    liveUrl: "https://example.com/prompt-us-pizzeria",
    image: promptUsImg,
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    type: "Web App",
    description:
      "A premium personal portfolio with animated sections, reusable components, and responsive layouts.",
    tech: ["React", "CSS", "Cluade"],
    image: portfolioImg,
  },
  {
    id: "Honorss",
    title: "Cabrillo Honors Club Website",
    type: "Website",
    description:
      "Led full-stack development of the Cabrillo College Honors Club website.",
    tech: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://jared-esquivel.github.io/Honors_Club_Webpage/",
    githubUrl: "",
    image: Honors,
  },
  {
    id: "HackWatsonvile",
    title: "HackWatsonville Website",
    type: "Website",
    description:
      "Designed and developed official website for a local community hackathon, later featured by Santa Cruz Works",
    tech: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://digitalnest.org",
    githubUrl: "",
    image: Hack,
  },
  {
    id: "nest-q",
    title: "NESTQueue IT Ticketing System",
    type: "Web App",
    description:
      "Developed an IT ticketing system for managing support requests and workflows.",
    tech: ["GO", "React", "TypeScript"],
    liveUrl: "https://github.com/jared-esquivel/nestqueue",
    githubUrl: "",
    image: Terminal,
  },
  {
    id: "digital-nest-pages",
    title: "The Island of Kauai",
    type: "Website",
    description:
      "Front-end and WordPress improvements supporting real website content, migration, and accessibility.",
    tech: ["HTML", "CSS", "JS"],
    liveUrl: "https://jared-esquivel.github.io/Visit-Kauai-now/",
    githubUrl: "",
    image: Island,
  },
];

function isExternal(url) {
  return typeof url === "string" && url.startsWith("http");
}

export default function SoftwareDevelopmentSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Used only to re-trigger the CSS fade animation on manual navigation
  const [fadeKey, setFadeKey] = useState(0);

  const project = PROJECTS[currentIndex];

  function goTo(index) {
    setCurrentIndex(index);
    setFadeKey((k) => k + 1);
  }

  function handleNext() {
    goTo((currentIndex + 1) % PROJECTS.length);
  }

  function handlePrev() {
    goTo((currentIndex - 1 + PROJECTS.length) % PROJECTS.length);
  }

  return (
    <section className="software-showcase" id="software">
      {/* Starry background, sits behind everything in this section.
          Clicks are disabled via CSS override (see .software-showcase
          .night-sky in the stylesheet) so shooting-star taps never
          compete with carousel/button interaction. Ambient twinkle
          and the occasional random shooting star still play. */}
      <div className="software-showcase-bg" aria-hidden="true">
        <NightSky count={70} />
      </div>

      <div className="showcase-shell">
        <header className="showcase-top">
          <p className="eyebrow">Selected Builds</p>
          <h2>Software Development</h2>
          <p>
            Interactive projects, front-end experiences, and concepts engineered
            into reality.
          </p>
        </header>

        <div className="showcase-stage">
          <button
            type="button"
            className="nav-btn prev"
            aria-label="Previous project"
            onClick={handlePrev}
          >
            ←
          </button>

          <article className="featured-project" key={fadeKey}>
            <div className="project-visual">
              <div className="mock-window">
                <div className="window-bar">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <img
                  src={project.image}
                  alt={project.title}
                  className="mock-window-image"
                />
              </div>
            </div>

            <div className="project-info">
              <p className="project-count">
                Project <span>{String(currentIndex + 1).padStart(2, "0")}</span>
              </p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="tech-stack">
                {project.tech.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className="project-actions">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target={isExternal(project.liveUrl) ? "_blank" : undefined}
                    rel={
                      isExternal(project.liveUrl)
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    Live Demo
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target={
                      isExternal(project.githubUrl) ? "_blank" : undefined
                    }
                    rel={
                      isExternal(project.githubUrl)
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </article>

          <button
            type="button"
            className="nav-btn next"
            aria-label="Next project"
            onClick={handleNext}
          >
            →
          </button>
        </div>

        <div className="preview-row" role="list" aria-label="All projects">
          {PROJECTS.map((p, index) => (
            <article
              key={p.id}
              className={
                "preview-card" + (index === currentIndex ? " active" : "")
              }
              onClick={() => goTo(index)}
              tabIndex={0}
              role="button"
              aria-pressed={index === currentIndex}
              aria-label={`View ${p.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goTo(index);
                }
              }}
            >
              <span className="preview-type">{p.type}</span>
              <h4>{p.title}</h4>
              <p>{p.description}</p>
            </article>
          ))}
        </div>

        <div className="dots" aria-hidden="true">
          {PROJECTS.map((p, index) => (
            <span
              key={p.id}
              className={"dot" + (index === currentIndex ? " active" : "")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
