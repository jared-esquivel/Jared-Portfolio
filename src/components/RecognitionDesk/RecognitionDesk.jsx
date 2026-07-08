import { useEffect, useRef, useState } from "react";
import "./RecognitionDesk.css";
import HSF from "../../assets/hsf-scholar.png";

// ---------- Data ----------
// Add an award by adding one object here — AwardRow renders every
// entry, no duplicated JSX per award.

const AWARDS = [
  {
    id: "hsf-scholar",
    year: "2026",
    name: "HSF Scholar",
    organization: "Hispanic Scholarship Fund",
    stamp: "National",
  },
  {
    id: "American Dream Award",
    year: "2026",
    name: "American Dream Award",
    organization: "Cabrillo Foundation",
    stamp: "Local",
  },
  {
    id: "hitec-scholar",
    year: "2025",
    name: "HITEC Foundation Scholar",
    organization:
      "Hispanic international technology executive counsel Foundation",
    stamp: "National",
  },
  {
    id: "pge-stem",
    year: "2025",
    name: "PG&E Better Together STEM Scholar",
    organization: "Pacific Gas and Electric Company",
    stamp: "Regional STEM Award",
  },
  {
    id: "union-plus",
    year: "2025",
    name: "Ruben Mejia STEM Foundation Award",
    organization: "Ruben Mejia STEM Foundation",
    stamp: "Local",
  },
  {
    id: "hhf-silver",
    year: "2024",
    name: "HHF Technology Silver Finalist",
    organization: "National Hispanic Heritage Foundation Youth Awards",
    stamp: "National",
  },
];

const FEATURED_RECOGNITION = {
  label: "Featured Recognition",
  title: "HSF Scholar",
  description:
    "Recognized as an HSF Scholar, selected from a pool of more than 50,000 applicants",
  image: HSF,
  ctaLabel: "View Recognition →",
  ctaHref:
    "https://www.linkedin.com/feed/update/urn:li:activity:7473041805069033473/",
};

const RESUME_SIGNOFF = {
  eyebrow: "End of Today's Edition",
  headline: "Want the complete story?",
  paragraph:
    "View my resume for experience, technical skills, internships, projects, leadership, and awards.",
  ctaLabel: "View Resume →",
  ctaHref:
    "https://docs.google.com/document/d/1xftrHe08N7Z4mA4a2XI278PutR-lzjn4/edit#heading=h.r4t1ocxzi88",
};

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Reveal-once hook ----------
// Shared across every section on this page: flips `isVisible` true
// the first time the element scrolls into view, then stops
// observing. CSS handles the actual transition.
function useRevealOnce(threshold = 0.2) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;

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
  }, [threshold]);

  return { ref, isVisible };
}

// ---------- Typewriter ----------
// Types `text` out once, starting only when `startTyping` becomes
// true. Guarded by hasStarted so it can never restart, even if the
// parent re-renders or startTyping flips again for any reason.
function useTypedHeading(text, startTyping) {
  const [displayed, setDisplayed] = useState(prefersReducedMotion ? text : "");
  const [isTyping, setIsTyping] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion || !startTyping || hasStarted.current) return;
    hasStarted.current = true;
    setIsTyping(true);

    let i = 0;
    const timeouts = [];

    function typeNextChar() {
      i += 1;
      setDisplayed(text.slice(0, i));

      if (i < text.length) {
        timeouts.push(setTimeout(typeNextChar, 80));
      } else {
        setIsTyping(false);
      }
    }

    typeNextChar();

    return () => timeouts.forEach(clearTimeout);
  }, [startTyping, text]);

  return { displayed, isTyping };
}

function AwardRow({ award, index, parentVisible }) {
  // Staggered "printing" delay, only meaningful once the parent list
  // has become visible — matches "award rows appear with a slight
  // stagger."
  const style = parentVisible
    ? { transitionDelay: `${0.15 + index * 0.08}s` }
    : undefined;

  return (
    <li
      className={"award-row" + (parentVisible ? " is-visible" : "")}
      style={style}
    >
      <strong className="award-row-year">{award.year}</strong>

      <div className="award-row-text">
        <h3>{award.name}</h3>
        <p>{award.organization}</p>
      </div>

      <span className="award-row-stamp">{award.stamp}</span>
    </li>
  );
}

export default function RecognitionDesk() {
  const header = useRevealOnce(0.3);
  const featured = useRevealOnce(0.2);
  const awardsList = useRevealOnce(0.1);
  const signoff = useRevealOnce(0.15);

  const { displayed: typedHeading, isTyping } = useTypedHeading(
    "The Recognition Desk",
    header.isVisible,
  );

  return (
    <section className="recognition-section" aria-label="The Recognition Desk">
      <div className="recognition-paper">
        {/* ---------- Masthead ---------- */}
        <div ref={header.ref}></div>

        {/* ---------- Featured recognition ---------- */}
        <article
          className={
            "featured-recognition" + (featured.isVisible ? " is-visible" : "")
          }
          ref={featured.ref}
        >
          <div className="featured-image">
            <img
              src={FEATURED_RECOGNITION.image}
              alt={FEATURED_RECOGNITION.title}
              className="featured-recognition-image"
            />
          </div>

          <div className="featured-recognition-text">
            <p>{FEATURED_RECOGNITION.label}</p>
            <h2>{FEATURED_RECOGNITION.title}</h2>
            <span>{FEATURED_RECOGNITION.description}</span>

            <a
              href={FEATURED_RECOGNITION.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${FEATURED_RECOGNITION.ctaLabel} ${FEATURED_RECOGNITION.title}`}
            >
              {FEATURED_RECOGNITION.ctaLabel}
            </a>
          </div>
        </article>

        {/* ---------- Honors & Awards ---------- */}
        <section className="recognition-list" aria-label="Honors and awards">
          <div className="list-heading">
            <p>Honors &amp; Awards</p>
            <span>Selected recognitions</span>
          </div>

          <ul className="award-rows" ref={awardsList.ref}>
            {AWARDS.map((award, index) => (
              <AwardRow
                key={award.id}
                award={award}
                index={index}
                parentVisible={awardsList.isVisible}
              />
            ))}
          </ul>
        </section>

        {/* ---------- Sign-off ---------- */}
        <footer
          className={"resume-strip" + (signoff.isVisible ? " is-visible" : "")}
          ref={signoff.ref}
        >
          <div>
            <p>{RESUME_SIGNOFF.eyebrow}</p>
            <h2>{RESUME_SIGNOFF.headline}</h2>
            <span>{RESUME_SIGNOFF.paragraph}</span>
          </div>
          <a
            href={RESUME_SIGNOFF.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={RESUME_SIGNOFF.ctaLabel}
          >
            {RESUME_SIGNOFF.ctaLabel}
          </a>
        </footer>
      </div>
    </section>
  );
}
