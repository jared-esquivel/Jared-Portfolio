import { useEffect, useRef, useState } from "react";
import "./MediaArchive.css";
import NESTGEN from "../../assets/NEST-GEN.jpg";
import Adobe from "../../assets/Adobe.png";
import HSF from "../../assets/hsf-scholar.png";
import Innovation from "../../assets/Innovation.png";
import Hack from "../../assets/Hack-Wat-article.png";
import article from "../../assets/Unsung.png";

// ---------- Data ----------
// Add an article by adding one object here. `variant: "quote"`
// renders as the pull-quote instead of a standard story — everything
// else maps to a normal article card.

const LEAD_STORY = {
  label: "Featured Story",
  headline: "NEST-GEN: Empowering Innovation & Transformation",
  meta: "",
  image: {
    src: NESTGEN,
    alt: "Students collaborating at HackWatsonville",
  },
  ctaLabel: "Read Story →",
  ctaHref:
    "https://digitalnest.org/news-and-blog/nest-gen-empowering-innovation-transformation/",
};

const ARTICLES = [
  {
    id: "adobe-panel",
    variant: "story",
    label: "Egineering Panel",
    headline: "Adobe Engineers Meet Cabrillo Students",
    meta: "LUCES Cabrillo • 2026",
    image: {
      src: Adobe,
      alt: "Engineers speaking to students at Cabrillo College",
    },
    ctaLabel: "Read Story →",
    ctaHref:
      "https://www.linkedin.com/feed/update/urn:li:activity:7460731911368232960/",
  },
  {
    id: "hsf-scholar",
    variant: "story",
    label: "Award",
    headline: "Over 50,000 applicants, HSF scholar designation",
    meta: "Scholarship News • 2026",
    image: {
      src: HSF,
      alt: "Scholarship recognition ceremony",
    },
    ctaLabel: "Read Story →",
    ctaHref:
      "https://www.linkedin.com/feed/update/urn:li:activity:7473041805069033473/",
  },
  {
    id: "pull-quote-1",
    variant: "quote",
    quote: "Don't wait for opportunities, build them.",
    attribution: "— Jared Esquivel",
  },
  {
    id: "city-of-watsonville",
    variant: "story",
    label: "Article",
    headline: "Meet the AHSC Interns: Jared Esquivel at Innovation Within",
    meta: "Santa Cruz Works • 2025",
    image: {
      src: Innovation,
      alt: "Classroom presentation at a local school",
    },
    ctaLabel: "Read Story →",
    ctaHref:
      "https://www.santacruzworks.org/news/meet-the-ahsc-interns-jared-esquivel-at-innovation-within",
  },
  {
    id: "digital-nest",
    variant: "story",
    label: "Article",
    headline: "HackWatsonville Ignites Innovation in Pajaro Valley",
    meta: "Santa Cruz Works • 2025",
    image: {
      src: Hack,
      alt: "Web development workspace",
    },
    ctaLabel: "Read Story →",
    ctaHref:
      "https://www.santacruzworks.org/news/coding-for-comunidad-hackwatsonville-ignites-innovation-in-the-pajaro-valley?rq=Jared",
  },
  {
    id: "ai-workshops",
    variant: "story",
    label: "Article",
    headline:
      "Unsung Santa Cruz: Digital NEST provides a powerful space for Latinx youth to grow tech skills",
    meta: "LookOut Santa Cruz • 2026",
    image: {
      src: article,
      alt: "Students in an AI ethics workshop",
    },
    ctaLabel: "Read Story →",
    ctaHref:
      "https://lookout.co/unsung-santa-cruz-digital-nest-provides-a-powerful-space-for-latinx-youth-to-grow-tech-skills/story",
  },
];

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Trigger: fires once when the section enters view ----------
function useSectionVisible(threshold = 0.15) {
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

// ---------- Typewriter for "The Archive" ----------
// Starts once, only after the section becomes visible; never
// restarts on subsequent intersections since the trigger itself
// (useSectionVisible) already unobserves after firing once.
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
        timeouts.push(setTimeout(typeNextChar, 85));
      } else {
        setIsTyping(false);
      }
    }

    typeNextChar();

    return () => timeouts.forEach(clearTimeout);
  }, [startTyping, text]);

  return { displayed, isTyping };
}

function StoryArticle({ article, style }) {
  return (
    <article className="archive-story" style={style}>
      <img src={article.image.src} alt={article.image.alt} loading="lazy" />
      <p className="archive-label">{article.label}</p>
      <h3>{article.headline}</h3>
      <p>{article.meta}</p>
      <a
        href={article.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${article.ctaLabel} ${article.headline}`}
      >
        {article.ctaLabel}
      </a>
    </article>
  );
}

function PullQuote({ article, style }) {
  return (
    <aside className="archive-pull-quote" style={style}>
      <span aria-hidden="true">&ldquo;</span>
      <p>{article.quote}</p>
      <small>{article.attribution}</small>
    </aside>
  );
}

export default function MediaArchive() {
  const { ref: sectionRef, isVisible } = useSectionVisible();
  const { displayed: typedHeading, isTyping } = useTypedHeading(
    "The Archive",
    isVisible,
  );

  return (
    <section
      className={"archive-page" + (isVisible ? " is-active" : "")}
      ref={sectionRef}
      aria-label="The Archive"
    >
      <div className="archive-paper">
        <header className="archive-masthead">
          <div>
            <p className="archive-label">Page 02</p>
            <h2>
              {typedHeading}
              {!prefersReducedMotion &&
                (isTyping || typedHeading.length === 0) && (
                  <span className="archive-cursor" aria-hidden="true">
                    |
                  </span>
                )}
            </h2>
          </div>
        </header>

        <article className="archive-lead-article">
          <img
            src={LEAD_STORY.image.src}
            alt={LEAD_STORY.image.alt}
            loading="lazy"
          />
          <div className="archive-lead-copy">
            <p className="archive-label">{LEAD_STORY.label}</p>
            <h3>{LEAD_STORY.headline}</h3>
            <p>{LEAD_STORY.meta}</p>

            <a
              href={LEAD_STORY.ctaHref}
              aria-label={`${LEAD_STORY.ctaLabel} ${LEAD_STORY.headline}`}
            >
              {LEAD_STORY.ctaLabel}
            </a>
          </div>
        </article>

        <div className="archive-article-columns">
          {ARTICLES.map((article, index) => {
            // Stagger starts after the lead article's own reveal, so
            // the whole page feels like it's printing in sequence
            // rather than everything popping at once.
            const staggerDelay = `${0.35 + index * 0.09}s`;
            const style = isVisible
              ? { transitionDelay: staggerDelay }
              : undefined;

            return article.variant === "quote" ? (
              <PullQuote key={article.id} article={article} style={style} />
            ) : (
              <StoryArticle key={article.id} article={article} style={style} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
