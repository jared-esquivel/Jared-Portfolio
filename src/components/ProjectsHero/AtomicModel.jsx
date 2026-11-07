import { useEffect, useRef } from "react";
import "./AtomicModel.css";

const ORBIT_PATH =
  "M350,200 A150,56 0 1,1 50,200 A150,56 0 1,1 350,200";

// Reusable, continuously-animating atomic model. Each electron carries
// its motion path directly so it remains reliable when the site is served
// from a subpath with hash-based routing.
export default function AtomicModel() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;

    // Ensure SMIL is running without resetting its timeline. Resetting to
    // zero made the first visible movement feel delayed after navigation.
    if (typeof svg.unpauseAnimations === "function") {
      svg.unpauseAnimations();
    }

    // Respect reduced motion
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      typeof svg.pauseAnimations === "function"
    ) {
      svg.pauseAnimations();
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      className="atomic-model"
      viewBox="0 0 400 400"
      role="img"
      aria-label="Animated atomic model, the portfolio's visual signature"
    >
      <g className="atom-spin">
        <ellipse
          className="atomic-orbit orbit-one"
          cx="200"
          cy="200"
          rx="150"
          ry="56"
        />

        <g className="orbit-two-group">
          <ellipse
            className="atomic-orbit orbit-two"
            cx="200"
            cy="200"
            rx="150"
            ry="56"
          />
        </g>

        <g className="orbit-three-group">
          <ellipse
            className="atomic-orbit orbit-three"
            cx="200"
            cy="200"
            rx="150"
            ry="56"
          />
        </g>

        {/* Electron 1: base orbit */}
        <circle className="atomic-electron" r="7">
          <animateMotion
            path={ORBIT_PATH}
            dur="9s"
            repeatCount="indefinite"
            rotate="auto"
            begin="-2.5s"
          />
        </circle>

        {/* Electron 2: same path, but its group is rotated 60deg so
            it visually rides the second ring */}
        <g className="orbit-two-group">
          <circle className="atomic-electron" r="7">
            <animateMotion
              path={ORBIT_PATH}
              dur="12s"
              repeatCount="indefinite"
              rotate="auto"
              begin="-4s"
            />
          </circle>
        </g>

        {/* Electron 3: rotated -60deg, reversed direction */}
        <g className="orbit-three-group">
          <circle className="atomic-electron" r="7">
            <animateMotion
              path={ORBIT_PATH}
              dur="15s"
              repeatCount="indefinite"
              rotate="auto"
              keyPoints="1;0"
              keyTimes="0;1"
              calcMode="linear"
              begin="-6s"
            />
          </circle>
        </g>
      </g>

      <circle className="atomic-nucleus" cx="200" cy="200" r="17" />
    </svg>
  );
}
