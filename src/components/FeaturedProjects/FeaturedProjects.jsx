import NightSky from "../NightSky/NightSky";
import AuroraOverlay from "../AuroraOverlay/AuroraOverlay";
import "./FeaturedProjects.css";
import thinkFirstImg from "../../assets/think-first.png";
import pizzeriaImg from "../../assets/prompt-us-pizzeria.png";
import digitalNestImg from "../../assets/digital-nest.png";

// Project data lives in one array — add real images/links here later
// without touching any of the markup below.
const projects = [
  {
    id: "ai-math-workshop",
    title: "Think-First AI Studio",
    description:
      "An interactive learning tool that helps students use AI ethically for math support.",
    tech: ["React", "CSS", "JavaScript"],
    accent: "blue", // matches a modifier class in the CSS
    href: "https://jared-esquivel.github.io/Think-First-AI-Studio/",
    image: thinkFirstImg,
  },
  {
    id: "portfolio-hero",
    title: "Digital NEST Website",
    description:
      "Developed the new Digital NEST website in WordPress, implementing SEO best practices, accessibility improvements, and front-end enhancements.",
    tech: ["WordPress", "Kadence", "Custom CSS", "PHP"],
    accent: "violet",
    href: "https://digitalnest.org/",
    image: digitalNestImg,
  },
  {
    id: "prompt-us-pizzeria",
    title: "Prompt-Us Pizzeria",
    description:
      "Interactive personal identifiable information training tool for nonprofits, equipping users to recognize and secure sensitive personal data,",
    tech: ["React", "Phaser 3", "Tailwind.css", "JavaScript"],
    accent: "amber",
    href: "https://prompt-us-pizzeria.pages.dev/",
    image: pizzeriaImg,
  },
];

export default function FeaturedProjects() {
  return (
    <section className="projects-section">
      {/* Existing background layers, untouched — just rendered here so
          they sit behind this section's content */}
      <NightSky />
      <AuroraOverlay />

      {/* All real content lives inside this shell, above both
          background layers via z-index (set in the CSS) */}
      <div className="projects-shell">
        {/* Section heading */}
        <header className="projects-header">
          <p className="projects-kicker">Featured Projects</p>
          <h2 className="projects-heading">Things I&rsquo;ve Built</h2>
          <p className="projects-intro">
            A collection of projects showcasing clean design, intuitive user
            experiences, and modern web development.
          </p>
        </header>

        {/* Card grid — single column on mobile, up to 3 across on desktop */}
        <div className="projects-grid">
          {projects.map((project) => (
            <article
              key={project.id}
              className={`project-card project-card--${project.accent}`}
            >
              {/* Image/mockup placeholder area */}
              <div className="project-media">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                />
              </div>

              <div className="project-body">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <ul className="project-tech-list">
                  {project.tech.map((tech) => (
                    <li key={tech} className="project-tech-tag">
                      {tech}
                    </li>
                  ))}
                </ul>

                <a
                  href={project.href}
                  className="project-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
