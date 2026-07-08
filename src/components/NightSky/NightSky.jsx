import { useEffect, useMemo, useRef, useState } from "react";
import "./NightSky.css";

// ---------- Existing static star field (unchanged) ----------

function makeStar(id) {
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const size = 1 + Math.random() * 2;
  const isBlue = Math.random() < 0.18;
  const isBright = Math.random() < 0.12;
  const baseOpacity = isBright
    ? 0.6 + Math.random() * 0.25
    : 0.15 + Math.random() * 0.3;
  const duration = 3 + Math.random() * 5;
  const delay = Math.random() * 6;

  return { id, top, left, size, isBlue, baseOpacity, duration, delay };
}

// ---------- Shooting stars (existing random logic, now reusable) ----------

let shootingStarId = 0;

// Builds one shooting star's flight properties. Accepts an optional
// `origin` ({ top, left } in percent) so the same builder can be used
// for both the random autonomous stars AND click/tap-triggered ones.
// If no origin is passed, it picks a random starting point exactly
// like before.
function makeShootingStar(origin) {
  shootingStarId += 1;

  const startTop = origin ? origin.top : Math.random() * 55; // percent
  const startLeft = origin ? origin.left : Math.random() * 80; // percent

  const travelDistance = 180 + Math.random() * 160; // px
  const angle = 20 + Math.random() * 20; // degrees, diagonal down-right

  const duration = 0.8 + Math.random() * 0.7; // 0.8s–1.5s
  const isBright = Math.random() < 0.2;
  const isBlue = Math.random() < 0.35;

  return {
    id: shootingStarId,
    startTop,
    startLeft,
    travelDistance,
    angle,
    duration,
    isBright,
    isBlue,
  };
}

export default function NightSky({ count = 110 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => makeStar(i));
  }, [count]);

  const [shootingStars, setShootingStars] = useState([]);
  const timersRef = useRef([]);

  // Ref on the container so we can measure it for click/tap coordinates
  const containerRef = useRef(null);

  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current;

  // Adds one shooting star to state and schedules its own removal once
  // its animation has had time to finish. `origin` is optional — pass
  // it for a click-triggered star, omit it for a random one.
  function spawnShootingStar(origin) {
    const star = makeShootingStar(origin);
    setShootingStars((prev) => [...prev, star]);

    const cleanupTimer = setTimeout(
      () => {
        setShootingStars((prev) => prev.filter((s) => s.id !== star.id));
      },
      star.duration * 1000 + 200,
    );

    timersRef.current.push(cleanupTimer);
  }

  // ---------- Existing autonomous random scheduling (unchanged) ----------
  useEffect(() => {
    if (prefersReducedMotion) return;

    function scheduleNext() {
      const roll = Math.random();

      let waitMs;
      if (roll < 0.15) {
        waitMs = (20 + Math.random() * 10) * 1000; // 20s–30s
      } else {
        waitMs = (8 + Math.random() * 12) * 1000; // 8s–20s
      }

      const timer = setTimeout(() => {
        spawnShootingStar();

        if (Math.random() < 0.12) {
          const followUp = setTimeout(
            () => spawnShootingStar(),
            600 + Math.random() * 1400,
          );
          timersRef.current.push(followUp);
        }

        scheduleNext();
      }, waitMs);

      timersRef.current.push(timer);
    }

    scheduleNext();

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [prefersReducedMotion]);

  // ---------- New: click / tap-triggered shooting star ----------

  function handlePointerDown(e) {
    // Respect reduced motion: no tap-triggered stars at all
    if (prefersReducedMotion) return;
    if (!containerRef.current) return;

    // Convert the click/tap's pixel position into a percentage
    // relative to the NightSky container, since stars are positioned
    // with top/left percentages just like the random ones.
    const rect = containerRef.current.getBoundingClientRect();
    const leftPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const topPercent = ((e.clientY - rect.top) / rect.height) * 100;

    // One star per tap — reuses the exact same creation/removal logic
    // as the random shooting stars, just anchored to this origin.
    spawnShootingStar({ top: topPercent, left: leftPercent });
  }

  return (
    <div
      className="night-sky"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      aria-hidden="true"
    >
      {/* Static star field */}
      {stars.map((star) => (
        <span
          key={star.id}
          className={"night-star" + (star.isBlue ? " night-star--blue" : "")}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            "--star-opacity": star.baseOpacity,
            "--star-duration": `${star.duration}s`,
            "--star-delay": `${star.delay}s`,
          }}
        />
      ))}

      {/* Shooting stars — both random and click-triggered render here */}
      {shootingStars.map((s) => (
        <span
          key={s.id}
          className={
            "shooting-star" +
            (s.isBright ? " shooting-star--bright" : "") +
            (s.isBlue ? " shooting-star--blue" : "")
          }
          style={{
            top: `${s.startTop}%`,
            left: `${s.startLeft}%`,
            "--travel-distance": `${s.travelDistance}px`,
            "--travel-angle": `${s.angle}deg`,
            "--shoot-duration": `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
