import { useEffect, useRef, useState } from "react";
import { startSparksBackground } from "./sparksBackground.js";
import "./LeadershipSection.css";
import hackwatsonvilleImg from "../../assets/HackWatsonville-logo.png";
import Adobe from "../../assets/Adobe.png";
import Joby from "../../assets/Joby.png";
import mathPlusImg from "../../assets/think-first.png";
import Icon from "../../assets/Cyber-Icon.png";

const LEADERSHIP = [
  {
    id: "hackwatsonville",
    number: "01",
    title: "HackWatsonville",
    kicker: "Founder & Director",
    description:
      "Founded a community hackathon expanding Hispanic access to technology through student-driven innovation.",
    tags: ["Leadership", "Community", "Technology"],
    accent: "#00e5ff",
    accent2: "#2f7dff",
    image: hackwatsonvilleImg,
  },
  {
    id: "Adobe-Engineering-Panel",
    number: "02",
    title: "Adobe Engineering-Panel",
    kicker: "LUCES Cabrillo",
    description:
      "Led an Adobe HOLA engineering panel, creating opportunities for students to engage directly with Adobe engineers.",
    tags: ["Egineering", "Panel", "Leadership"],
    accent: "#20ff9f",
    accent2: "#00d9c4",
    image: Adobe,
  },
  {
    id: "Joby",
    number: "03",
    title: "Joby Aviation Panel",
    kicker: "Student Organizer",
    description:
      "Hosted a Joby Aviation engineering panel at my college, connecting students with engineers and industry professionals..",
    tags: ["STEM", "Panels", "Students"],
    accent: "#a66bff",
    accent2: "#4f7dff",
    image: Joby,
  },
  {
    id: "math-plus",
    number: "04",
    title: "Math PLUS AI Workshop",
    kicker: "Workshop Host",
    description:
      "Developing an AI workshop to help students use AI responsibly, strengthen math problem-solving skills, and better understand the technology. Coming soon.",
    tags: ["AI", "Workshop", "Math"],
    accent: "#7cffcb",
    accent2: "#00e0ff",
    image: mathPlusImg,
  },
  {
    id: "Cyber",
    number: "05",
    title: "Cyber Security & IT Panel",
    kicker: "Community Builder",
    description:
      "Hosting a cybersecurity panel connecting students directly with cybersecurity analysts to explore career paths and gain firsthand industry insights. Coming soon.",
    tags: ["Mentorship", "Panel", "Cybersecurity"],
    accent: "#2f9bff",
    accent2: "#ff40dc",
    image: Icon,
  },
];

function LeadershipPanel({ item, isOpen, onToggle }) {
  const panelId = `leadership-panel-${item.id}`;
  const buttonId = `leadership-button-${item.id}`;

  return (
    <article
      className={"leadership-panel" + (isOpen ? " active" : "")}
      style={{
        "--accent": item.accent,
        "--accent-2": item.accent2,
      }}
    >
      <button
        type="button"
        id={buttonId}
        className="panel-tab"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{item.title}</span>
        <strong>{item.number}</strong>
      </button>

      <div
        id={panelId}
        className="panel-content"
        role="region"
        aria-labelledby={buttonId}
      >
        <div className="panel-visual">
          <img src={item.image} alt={item.title} className="panel-image" />
        </div>

        <div className="panel-info">
          <p className="panel-kicker">{item.kicker}</p>
          <h3>{item.title}</h3>
          <p>{item.description}</p>

          <div className="panel-tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function LeadershipSection() {
  const canvasRef = useRef(null);
  const panelRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = startSparksBackground(canvasRef.current);
    return cleanup;
  }, []);

  function handleToggle(index) {
    if (activeIndex === index) {
      setActiveIndex(null);
      return;
    }

    setActiveIndex(index);

    requestAnimationFrame(() => {
      setTimeout(() => {
        panelRefs.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 320);
    });
  }

  return (
    <section className="leadership-section">
      <canvas
        ref={canvasRef}
        className="leadership-canvas"
        aria-hidden="true"
      />

      <div className="leadership-shell">
        <header className="leadership-header">
          <p className="eyebrow">Beyond the Code</p>
          <h2>Leadership</h2>
          <p>
            Community initiatives, industry panels, and moments where I helped
            connect students with new opportunities.
          </p>
        </header>

        <div className="leadership-accordion">
          {LEADERSHIP.map((item, index) => (
            <div
              key={item.id}
              className={
                "leadership-panel-wrap" +
                (activeIndex === index ? " active" : "")
              }
              ref={(node) => {
                panelRefs.current[index] = node;
              }}
            >
              <LeadershipPanel
                item={item}
                isOpen={activeIndex === index}
                onToggle={() => handleToggle(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
