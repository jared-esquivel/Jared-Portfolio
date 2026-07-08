import { useEffect, useRef, useState } from "react";
import { startContactNetwork } from "./contactNeuralCanvas.js";
import "./ContactSection.css";

// ---------- Data ----------
// Add or reorder contact buttons by editing this array — no markup
// changes needed elsewhere.
const CONTACT_LINKS = [
  {
    id: "email",
    label: "Email Me",
    icon: "📧",
    href: "mailto:jaredesquivel24@gmail.com",
    variant: "primary",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "💼",
    href: "https://www.linkedin.com/in/jared-esquivel-0a699632a/",
    variant: "secondary",
  },
  {
    id: "github",
    label: "GitHub",
    icon: "💻",
    href: "https://github.com/jared-esquivel",
    variant: "secondary",
  },
  {
    id: "resume",
    label: "Resume",
    icon: "📄",
    href: "https://docs.google.com/document/d/1xftrHe08N7Z4mA4a2XI278PutR-lzjn4/edit?usp=sharing&ouid=103862160462904518417&rtpof=true&sd=true",
    variant: "secondary",
  },
];

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ContactSection() {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = startContactNetwork(canvasRef.current);
    return cleanup;
  }, []);

  // A single gentle fade-up for the whole content block on first
  // load — this is the section's closing moment, so it gets one
  // calm entrance rather than staggered piece-by-piece reveals.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="contact-section">
      <canvas ref={canvasRef} className="contact-canvas" aria-hidden="true" />

      <div className={"contact-content" + (isVisible ? " is-visible" : "")}>
        <h1 className="contact-heading">
          Let’s build something unforgettable! .
        </h1>

        <p className="contact-text">
          Available for software engineering internships, website development,
          AI workshops, speaking engagements, and community collaborations.
        </p>

        <div className="contact-buttons">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`contact-button contact-button--${link.variant}`}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              <span className="contact-button-icon" aria-hidden="true">
                {link.icon}
              </span>

              {link.label}
            </a>
          ))}
        </div>

        <footer className="contact-footer">
          <p className="contact-location">📍 Watsonville, California</p>
          <p className="contact-copyright">
            © {new Date().getFullYear()} Jared Esquivel. Innovation is the
            notion of change.
          </p>
        </footer>
      </div>
    </section>
  );
}
