import { useEffect, useRef, useState } from "react";
import "./EngineeringSection.css";
import engineeringOneImg from "../../assets/Eng.png";
import engineeringTwoImg from "../../assets/Island.png";
import engineeringThreeImg from "../../assets/plate_1.png";
import Micro from "../../assets/Micro.png";

const ENGINEERING_PROJECTS = [
  {
    id: "project-one",
    title: "ROV Engineering Project",
    description:
      "Designed and built an underwater ROV, applying engineering design, prototyping, and hands-on problem-solving.",
    image: "projectOne",
    image: engineeringOneImg,
    theme: "light", // black text
  },
  {
    id: "project-two",
    title: "Micro Python Raspberry PI Configuration",
    description:
      "Configured and programmed a Raspberry Pi using MicroPython to build embedded systems and hardware control applications.",
    image: Micro,
    theme: "light", // white text
  },
  {
    id: "project-three",
    title: "Engineering 3-D Redering Model",
    description:
      "Designed 3D-printable models, applying tinker CAD and prototyping to bring engineering concepts to life.",
    image: engineeringThreeImg,
    theme: "light", // white text
  },
];

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function EngineeringPanel({ item, index, isVisible }) {
  return (
    <article
      className={
        `engineering-panel engineering-panel--${item.theme}` +
        (isVisible ? " is-visible" : "")
      }
      style={{
        transitionDelay: prefersReducedMotion ? "0ms" : `${index * 100}ms`,
      }}
    >
      <div className="engineering-panel-image">
        <img src={item.image} alt={item.title} className="engineering-image" />
      </div>

      <div className="engineering-panel-overlay">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </article>
  );
}

function useRevealOnce(threshold = 0.15) {
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
  }, [threshold]);

  return { ref, isVisible };
}

export default function EngineeringSection() {
  const panelsReveal = useRevealOnce(0.15);

  return (
    <section className="engineering-section" id="engineering">
      <div className="engineering-shell">
        <div className="engineering-top">
          <h2>
            Engineering
            <br />
            Projects
          </h2>

          <div>
            <p>
              Projects where I explored design, problem solving, and technical
              creativity.
            </p>
          </div>
        </div>

        <div className="engineering-panel-grid" ref={panelsReveal.ref}>
          {ENGINEERING_PROJECTS.map((item, index) => (
            <EngineeringPanel
              key={item.id}
              item={item}
              index={index}
              isVisible={panelsReveal.isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
