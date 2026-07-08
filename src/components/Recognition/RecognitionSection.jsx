import { useEffect, useRef, useState } from "react";
import { startWaveBackground } from "./waveCanvas.js";
import featuredStoryImg from "../../assets/Hack-Wat-article.png";
import "./RecognitionSection.css";
import hsfImg from "../../assets/hsf-scholar.png";
import nestGenImg from "../../assets/nest-gen.png";

// ---------- Data ----------
// Add another recognition later by adding one object here — no
// markup changes needed. The layout only ever shows two small cards
// beside the featured story per the editorial design, so if you add
// a third, consider moving the oldest into an "more recognitions"
// list later; for now this array maps directly to the two small
// cards shown.
const RECOGNITIONS = [
  {
    id: "hsf-scholar",
    date: "2026",
    title: "Designated HSF Scholar Award",
    description:
      "Recognized as a 2026 Hispanic Scholarship Fund Scholar out of a pool of over 56,000 applicants.",
    variant: "cyan",
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7473041805069033473/",
    image: hsfImg,
  },
  {
    id: "NEST-GEN",
    date: "2025",
    title: "NEST-GEN: Empowering Innovation & Transformation",
    description: "A Future-Proof Program Model for Emerging Tech Leaders",
    variant: "violet",
    href: "https://digitalnest.org/news-and-blog/nest-gen-empowering-innovation-transformation/",
    image: nestGenImg,
  },
];

const FEATURED_STORY = {
  eyebrow: "Featured Story",
  title:
    "Hacking for Comunidad: HackWatsonville Ignites Innovation in Pajaro Valley",
  description:
    "Spearheaded by the dedicated efforts of Jared Esquivel, Watsonville High School is set to host its inaugural hackathon, HackWatsonville 2025. ",
  href: "https://www.santacruzworks.org/news/coding-for-comunidad-hackwatsonville-ignites-innovation-in-the-pajaro-valley?rq=Hacking%20for",
  image: featuredStoryImg,
};

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Small reusable hook: reveals an element once when it first enters
// the viewport, then stops observing.
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

function RecognitionCard({ item, index, isVisible }) {
  return (
    <article
      className={
        `small-card small-card--${item.variant}` +
        (isVisible ? " is-visible" : "")
      }
      style={{
        transitionDelay: prefersReducedMotion ? "0ms" : `${index * 110}ms`,
      }}
    >
      <div className="card-image">
        <img src={item.image} alt={item.title} className="card-story-image" />
      </div>
      <div className="card-content">
        <p className="date">{item.date}</p>
        <h3>{item.title}</h3>
        <p>{item.description}</p>

        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link"
        >
          Read Story →
        </a>
      </div>
    </article>
  );
}

export default function RecognitionSection() {
  const canvasRef = useRef(null);
  const cardsReveal = useRevealOnce(0.25);
  const featuredReveal = useRevealOnce(0.2);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = startWaveBackground(canvasRef.current);
    return cleanup;
  }, []);

  return (
    <section className="recognition">
      <canvas
        ref={canvasRef}
        className="recognition-canvas"
        aria-hidden="true"
      />

      <div className="recognition-container">
        {/* LEFT SIDE */}
        <div className="recognition-left">
          <div className="recognition-header">
            <p className="eyebrow">Recognition &amp; Media</p>
            <h1>
              Recognition
              <br />
              &amp; Media.
            </h1>
            <p className="intro">
              Awards, scholarships, speaking engagements, and moments that shape
              my journey.
            </p>
          </div>

          <div className="small-cards" ref={cardsReveal.ref}>
            {RECOGNITIONS.map((item, index) => (
              <RecognitionCard
                key={item.id}
                item={item}
                index={index}
                isVisible={cardsReveal.isVisible}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="recognition-right">
          <article
            className={
              "featured-card" + (featuredReveal.isVisible ? " is-visible" : "")
            }
            ref={featuredReveal.ref}
          >
            <div className="featured-image">
              <img
                src={FEATURED_STORY.image}
                alt={FEATURED_STORY.title}
                className="featured-story-image"
              />
            </div>
            <div className="featured-content">
              <p className="date">{FEATURED_STORY.eyebrow}</p>
              <h2>{FEATURED_STORY.title}</h2>
              <p>{FEATURED_STORY.description}</p>
              <a target="_blank" href={FEATURED_STORY.href}>
                Read Story →
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
