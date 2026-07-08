import { useEffect, useRef, useState } from "react";
import "./MediaDesk.css";
import dream from "../../assets/American-dream.png";

// ---------- Data ----------

const MASTHEAD_TITLE = "The Media Desk";

const HEADLINES = [
  {
    text: "Jared Esquivel Named American Dream Scholarship Recipient",
    badge: "breaking",
  },
  {
    text: "Cabrillo LUCES representative Jared hosted an Adobe Engineering Panel",
    badge: "latest",
  },
  {
    text: "Jared recognized as an HSF Scholar, selected from a pool of more than 50,000 applicants",

    badge: "breaking",
  },
  {
    text: "Digital NEST's New Website Refresh Is Live!",
    badge: "latest",
  },
  {
    text: "New AI Workshop Coming to Math PLUS at Cabrillo College",
    badge: "latest",
  },
];

const FEATURED_STORY = {
  sectionLabel: "Featured Story",
  headline: "American Dream Scholar",
  description:
    "I thought the biggest value of a scholarship was the financial support... I realized the biggest value was something else entirely:",
  image: {
    src: dream,
    alt: "Jared Esquivel media feature",
    caption: "",
  },
  ctaLabel: "View the story now",
  ctaHref:
    "https://www.linkedin.com/feed/update/urn:li:activity:7467968363940704256/",
};

const QUOTE = {
  text: "Real growth can't happen if you stay in your comfort zone.",
};

const MASTHEAD_META = {
  volume: "Vol. 01",
  location: "",
  publication: "Portfolio Journal",
  byline: "Jared Esquivel Portfolio Journal",
};

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Trigger: fires once when the section enters view ----------
// Drives the whole entrance sequence (scan, dividers, typing, cards)
// so everything animates together, once, the first time it's seen.
function useSectionVisible(threshold = 0.25) {
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

// ---------- Typing masthead ----------
function useTypedTitle(text, startTyping) {
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
        timeouts.push(setTimeout(typeNextChar, 95));
      } else {
        setIsTyping(false);
      }
    }

    typeNextChar();

    return () => timeouts.forEach(clearTimeout);
  }, [startTyping, text]);

  return { displayed, isTyping };
}

// ---------- Headline ticker ----------
function useHeadlineTicker(headlines, intervalMs = 3500) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || headlines.length <= 1) return;

    let swapTimeout;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      swapTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % headlines.length);
        setIsTransitioning(false);
      }, 250);
    }, intervalMs);

    return () => {
      clearInterval(interval);
      clearTimeout(swapTimeout);
    };
  }, [headlines.length, intervalMs]);

  return { current: headlines[index], isTransitioning };
}

export default function MediaDesk() {
  const { ref: sectionRef, isVisible } = useSectionVisible();
  const { displayed: typedTitle, isTyping } = useTypedTitle(
    MASTHEAD_TITLE,
    isVisible,
  );
  const { current: headline, isTransitioning } = useHeadlineTicker(HEADLINES);

  return (
    <section
      className={"media-desk" + (isVisible ? " is-active" : "")}
      ref={sectionRef}
      aria-label="Media Desk"
    >
      <div className="media-desk-newspaper">
        {/* Printing-press scan: a single soft light sweep across the
            paper, once, on entrance */}
        <span className="media-desk-scan" aria-hidden="true" />

        <div className="media-desk-top-label">
          <span>{MASTHEAD_META.volume}</span>
          <span>{MASTHEAD_META.location}</span>
          <span>{MASTHEAD_META.publication}</span>
        </div>

        <header className="media-desk-masthead">
          <p>{MASTHEAD_META.byline}</p>
          <h1>
            {typedTitle}
            {!prefersReducedMotion && (isTyping || typedTitle.length === 0) && (
              <span className="media-desk-cursor" aria-hidden="true">
                |
              </span>
            )}
          </h1>
        </header>

        <div
          className="media-desk-rule media-desk-rule--thick"
          role="separator"
        />

        <div className="media-desk-breaking-row">
          <span
            className={
              "media-desk-badge" +
              (headline.badge === "breaking" ? " is-breaking" : " is-latest")
            }
          >
            ● {headline.badge === "breaking" ? "Breaking" : "Latest"}
          </span>
          <p
            className={
              "media-desk-headline-text" +
              (isTransitioning ? " is-transitioning" : "")
            }
            aria-live="polite"
          >
            {headline.text}
          </p>
        </div>

        <div
          className="media-desk-rule media-desk-rule--thin"
          role="separator"
        />

        <main className="media-desk-front-page">
          <article className="media-desk-featured-story">
            <figure className="media-desk-featured-image">
              <img
                src={FEATURED_STORY.image.src}
                alt={FEATURED_STORY.image.alt}
              />
              <figcaption>{FEATURED_STORY.image.caption}</figcaption>
            </figure>

            <div className="media-desk-featured-content">
              <p className="media-desk-section-label">
                {FEATURED_STORY.sectionLabel}
              </p>
              <h2>{FEATURED_STORY.headline}</h2>
              <p>{FEATURED_STORY.description}</p>
              <a
                href={FEATURED_STORY.ctaHref}
                className="media-desk-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                {FEATURED_STORY.ctaLabel}
              </a>
            </div>
          </article>

          <aside className="media-desk-quote-card" aria-label="Featured quote">
            <span aria-hidden="true">&ldquo;</span>
            <p>{QUOTE.text}</p>
          </aside>
        </main>
      </div>
    </section>
  );
}
