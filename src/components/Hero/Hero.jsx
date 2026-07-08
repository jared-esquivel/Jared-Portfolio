import { useEffect, useRef, useState } from "react";
import "./Hero.css";
import { startAurora } from "./auroraCanvas.js";

// Turns a string into individual letter spans that fade/slide in
// one at a time as `revealCount` grows. `gradient` applies the
// blue -> mint gradient styling (used for "Jared").
function renderLetters(text, revealCount, gradient = false) {
  return text.split("").map((char, i) => (
    <span
      key={i}
      className={
        "greeting-letter" +
        (i < revealCount ? " is-visible" : "") +
        (gradient ? " is-gradient" : "")
      }
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

function AnimatedGreeting({ start, onComplete }) {
  const line1 = "Hey there!";
  const prefix = "I'm ";
  const name = "Jared";
  const line2 = prefix + name; // "I'm Jared"

  const [revealLine1, setRevealLine1] = useState(0);
  const [revealLine2, setRevealLine2] = useState(0);
  const [showUnderline, setShowUnderline] = useState(false);
  const [cursorDone, setCursorDone] = useState(false);

  // Read reduced-motion preference once, on mount
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current;

  useEffect(() => {
    if (!start && !prefersReducedMotion) return;
    // If the user prefers reduced motion, skip the animation entirely
    // and show the final state right away.
    if (prefersReducedMotion) {
      setRevealLine1(line1.length);
      setRevealLine2(line2.length);
      setShowUnderline(true);
      setCursorDone(true);
      // Let the parent know the greeting is "done" immediately too
      if (onComplete) onComplete();
      return;
    }

    const timeouts = [];
    const schedule = (fn, delay) => timeouts.push(setTimeout(fn, delay));

    let elapsed = 0;
    const charSpeed = 55; // ms per letter for "Hey there!" and "I'm "
    const nameSpeed = 110; // slower, calmer speed for "Jared"
    const pauseAfterLine1 = 450;

    // Type "Hey there!" one letter at a time
    for (let i = 1; i <= line1.length; i++) {
      schedule(() => setRevealLine1(i), elapsed);
      elapsed += charSpeed;
    }

    elapsed += pauseAfterLine1;

    // Type "I'm " then "Jared" (slower) into the second line
    for (let i = 1; i <= line2.length; i++) {
      const speed = i <= prefix.length ? charSpeed : nameSpeed;
      schedule(() => setRevealLine2(i), elapsed);
      elapsed += speed;
    }

    // Draw the underline shortly after "Jared" finishes typing
    schedule(() => setShowUnderline(true), elapsed + 200);

    // Let the cursor blink a little longer, then fade it out.
    // Once it's done, tell the parent the greeting is fully finished
    // so it can bring in the rotating title.
    schedule(() => {
      setCursorDone(true);
      if (onComplete) onComplete();
    }, elapsed + 900);

    return () => timeouts.forEach(clearTimeout);
  }, [prefersReducedMotion, start]);

  return (
    <div className="animated-greeting">
      <p className="greeting-line greeting-line--intro">
        {renderLetters(line1, revealLine1)}
      </p>

      <h1 className="greeting-line greeting-line--name">
        <span className="greeting-prefix">
          {renderLetters(prefix, Math.min(revealLine2, prefix.length))}
        </span>

        <span className="greeting-name-wrap">
          {renderLetters(name, Math.max(0, revealLine2 - prefix.length), true)}
          <span
            className={
              "greeting-underline" + (showUnderline ? " is-drawn" : "")
            }
          />
        </span>

        {revealLine1 > 0 && (
          <span
            className={"greeting-cursor" + (cursorDone ? " is-done" : "")}
          />
        )}
      </h1>
    </div>
  );
}

// The rotating job-title strip that appears under "I'm Jared" once the
// typing greeting has fully finished (name typed, underline drawn,
// cursor faded).
const ROTATING_TITLES = [
  {
    text: "Front-end Developer",
    gradient: "linear-gradient(90deg, #2f9bff, #00e0ff, #00d9c4, #7cffcb)",
  },
  {
    text: "Computer Science Student",
    gradient: "linear-gradient(90deg, #7c5cff, #b26bff, #ff8fe0)",
  },
  {
    text: "Student Leader",
    gradient: "linear-gradient(90deg, #00c2ff, #00e0ff, #7cffcb)",
  },
  {
    text: "Hackathon Founder",
    gradient: "linear-gradient(90deg, #7c5cff, #ff6ec7, #ffb0e0)",
  },
  {
    text: "Coffee Enthusiast",
    gradient: "linear-gradient(90deg, #2f9bff, #6a5cff, #b26bff)",
  },
  {
    text: "Builder",
    gradient: "linear-gradient(90deg, #00d9c4, #7cffcb, #2f9bff)",
  },
];

function RotatingTitle({ show }) {
  const [index, setIndex] = useState(0);
  // "idle"  = settled, sitting still
  // "out"   = currently playing the fade/blur/drop-out transition
  // "in"    = currently playing the fade/blur/rise-in transition
  const [phase, setPhase] = useState("idle");

  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current;

  useEffect(() => {
    // Don't start cycling until the greeting says it's done, and never
    // auto-rotate for reduced-motion users (they just see title #1, still).
    if (!show || prefersReducedMotion) return;

    let outTimeout;
    let inTimeout;

    const interval = setInterval(() => {
      // Step 1: play the calm "out" transition on the current title
      setPhase("out");

      // Step 2: once it's had time to fade/blur/drop away, swap the
      // text and play the "in" transition
      outTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROTATING_TITLES.length);
        setPhase("in");

        // Step 3: once the "in" transition finishes, settle back to idle
        inTimeout = setTimeout(() => setPhase("idle"), 700);
      }, 550);
    }, 4300); // every ~4.3s

    return () => {
      clearInterval(interval);
      clearTimeout(outTimeout);
      clearTimeout(inTimeout);
    };
  }, [show, prefersReducedMotion]);

  // Don't render anything until the greeting has finished typing
  if (!show) {
    return <div className="rotating-title-container" aria-hidden="true" />;
  }

  const current = ROTATING_TITLES[index];

  return (
    <div className="rotating-title-container">
      <span
        key={index}
        className={
          "rotating-title-text" + (phase === "out" ? " is-out" : " is-in")
        }
        style={{ backgroundImage: current.gradient }}
      >
        {current.text}
      </span>
    </div>
  );
}

export default function Hero() {
  const canvasRef = useRef(null);
  const [startGreeting, setStartGreeting] = useState(false);
  const [showRotatingTitle, setShowRotatingTitle] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = startAurora(canvasRef.current);
    return cleanup;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartGreeting(true);
    }, 4600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero">
      <canvas ref={canvasRef} id="aurora" />

      {/* Intro: idea becomes energy (unchanged) */}
      <div className="idea-intro" id="ideaIntro">
        <div className="idea-stage">
          <svg
            className="idea-bulb"
            viewBox="0 0 400 400"
            role="img"
            aria-label="Atom inside a lightbulb creating an aurora hero"
          >
            <circle className="intro-energy-ring" cx="200" cy="185" r="18" />

            <g className="intro-rays">
              <line x1="200" y1="35" x2="200" y2="70" />
              <line x1="105" y1="70" x2="130" y2="95" />
              <line x1="295" y1="70" x2="270" y2="95" />
              <line x1="65" y1="165" x2="100" y2="165" />
              <line x1="335" y1="165" x2="300" y2="165" />
            </g>

            <path
              className="intro-bulb-outline"
              d="M200 70 C130 70 90 120 90 180 C90 225 115 255 145 275 L145 305 L255 305 L255 275 C285 255 310 225 310 180 C310 120 270 70 200 70Z"
            />

            <path className="intro-bulb-base base-one" d="M150 325 H250" />
            <path className="intro-bulb-base base-two" d="M160 345 H240" />

            <g className="intro-atom">
              <ellipse
                className="intro-orbit orbit-one"
                cx="200"
                cy="185"
                rx="75"
                ry="28"
              />
              <ellipse
                className="intro-orbit orbit-two"
                cx="200"
                cy="185"
                rx="75"
                ry="28"
              />
              <ellipse
                className="intro-orbit orbit-three"
                cx="200"
                cy="185"
                rx="75"
                ry="28"
              />

              <g className="intro-electron-track track-one">
                <circle className="intro-electron" cx="275" cy="185" r="6" />
              </g>
              <g className="intro-electron-track track-two">
                <circle className="intro-electron" cx="275" cy="185" r="6" />
              </g>
              <g className="intro-electron-track track-three">
                <circle className="intro-electron" cx="275" cy="185" r="6" />
              </g>

              <circle className="intro-nucleus" cx="200" cy="185" r="13" />
            </g>
          </svg>

          <p className="intro-kicker">Idea Activating</p>
        </div>
      </div>

      {/* Main hero content — greeting + rotating title */}
      <div className={"hero-content" + (showRotatingTitle ? " has-title" : "")}>
        <AnimatedGreeting
          start={startGreeting}
          onComplete={() => setShowRotatingTitle(true)}
        />
        <RotatingTitle show={showRotatingTitle} />
      </div>
    </section>
  );
}
