import { useEffect, useRef, useState } from "react";
import "./ExperienceTimeline.css";

// ---------- Data (unchanged) ----------
const experiences = [
  {
    id: "digital-nest",
    organization: "Digital NEST",
    role: "Web Development Associate",
    date: "2025 – Present",
    description:
      "Co-Devloped an interactive PII training tool using JavaScript and Phaser 3. Collaborated in an Agile team using React, TypeScript, and AI tools.",
    image: null,
  },
  {
    id: "Innovation Within",
    organization: "Innovation Within",
    role: " UI/UX & Go-To-Market (GTM) Intern",
    date: "2025",
    description:
      "Conducted user-focused analysis for an AI customer discovery platform to improve usability and product experience.",
    image: null,
  },
  {
    id: "hackwatsonville",
    organization: "HackWatsonville",
    role: "Founder & Lead Organizer",
    date: "2025",
    description:
      "Founded WHS's first student-run hackathon, securing $650+ in sponsorships and recruiting industry mentors.",
    image: null,
  },
  {
    id: "WIT-CTE",
    organization: "PVUSD CTE & Digital NEST",
    role: "Web & IT Career Technical Intern",
    date: "2025",
    description:
      "Built responsive, accessible websites with HTML, CSS, JavaScript, PHP, and WordPress, presenting projects at Levi's Stadium.",
    image: null,
  },
  {
    id: "city-of-watsonville",
    organization: "City of Watsonville",
    role: "Information Technology Intern",
    date: "Summer 2023",
    description:
      "Provided IT support across city departments, troubleshooting systems, managing hardware, and supporting daily technical operations.",
    image: null,
  },
];

// One accent color per card, cycled by index — derived here, not
// stored in the data array, so the array/map stay untouched.
const ACCENTS = ["#00e0ff", "#7cffcb", "#b26bff", "#2f9bff"];

// ---------- Scroll reveal hook ----------
function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

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
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// ---------- One timeline item ----------
function TimelineItem({ experience, index }) {
  const { ref, isVisible } = useScrollReveal();
  const side = index % 2 === 0 ? "left" : "right";
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <li
      ref={ref}
      className={
        "timeline-item" +
        (isVisible ? " is-visible" : "") +
        ` timeline-item--${side}`
      }
      style={{ "--accent": accent }}
    >
      <div className="timeline-node">
        <span className="timeline-node-ring" />
        {experience.image ? (
          <img
            src={experience.image}
            alt={`${experience.organization} logo`}
            className="timeline-logo"
          />
        ) : (
          <span className="timeline-logo timeline-logo--placeholder" />
        )}
      </div>

      <article className="timeline-card">
        <span className="timeline-card-edge" />

        <p className="timeline-date">{experience.date}</p>

        <h3 className="timeline-org">
          {experience.organization}
          <span className="timeline-org-underline" />
        </h3>

        <p className="timeline-role">{experience.role}</p>
        <p className="timeline-description">{experience.description}</p>
      </article>
    </li>
  );
}

// ---------- The timeline beam ----------
function TimelineBeam() {
  return (
    <svg
      className="timeline-beam"
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2f9bff" />
          <stop offset="20%" stopColor="#00e0ff" />
          <stop offset="40%" stopColor="#00d9c4" />
          <stop offset="60%" stopColor="#7cffcb" />
          <stop offset="80%" stopColor="#8c64ff" />
          <stop offset="100%" stopColor="#2f9bff" />
        </linearGradient>
        <linearGradient id="beamHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      <path
        className="timeline-beam-path"
        d="M50,0
           C30,60 70,120 50,180
           C30,240 70,300 50,360
           C30,420 70,480 50,540
           C30,600 70,660 50,720
           C30,780 70,840 50,900
           C40,940 55,970 50,1000"
        stroke="url(#beamGradient)"
        strokeWidth="3"
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
      />

      <path
        className="timeline-beam-pulse"
        d="M50,0
           C30,60 70,120 50,180
           C30,240 70,300 50,360
           C30,420 70,480 50,540
           C30,600 70,660 50,720
           C30,780 70,840 50,900
           C40,940 55,970 50,1000"
        stroke="url(#beamHighlight)"
        strokeWidth="5"
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeDasharray="120 1400"
      />
    </svg>
  );
}

// ---------- Atmospheric light blooms ----------
// Tiny, soft pockets of energy living in the negative space around
// the content — never behind cards, headings, or nodes. Each bloom
// fades in slowly, holds briefly, fades out slowly, then pauses
// before its next cycle. Durations are all different (and not round
// numbers) so blooms never sync into an obvious loop; at any moment
// only a handful are gently visible.
function AtmosphericGlow() {
  return (
    <div className="timeline-glow-field" aria-hidden="true">
      <span className="timeline-glow timeline-glow--1" />
      <span className="timeline-glow timeline-glow--2" />
      <span className="timeline-glow timeline-glow--3" />
      <span className="timeline-glow timeline-glow--4" />
      <span className="timeline-glow timeline-glow--5" />
      <span className="timeline-glow timeline-glow--6" />
      <span className="timeline-glow timeline-glow--7" />
    </div>
  );
}

export default function ExperienceTimeline() {
  return (
    <section id="experience" className="timeline-section">
      <AtmosphericGlow />

      <div className="timeline-shell">
        <header className="timeline-header">
          <p className="timeline-kicker">Experience</p>
          <h2 className="timeline-heading">The Journey So Far</h2>
          <p className="timeline-intro">
            A timeline of the roles and milestones.
          </p>
        </header>

        <div className="timeline-track">
          <TimelineBeam />

          <ul className="timeline-list">
            {experiences.map((experience, index) => (
              <TimelineItem
                key={experience.id}
                experience={experience}
                index={index}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
