import { useEffect, useRef } from "react";
import "./AtomicModel.css";

// Reusable, continuously-animating atomic model. Electrons use
// SVG's <animateMotion> + <mpath> to travel along the exact
// elliptical orbit path, rather than rotating a group around the
// ellipse's center (which traces a circle, not the ellipse itself —
// that mismatch was the earlier "electrons feel detached" bug).
export default function AtomicModel() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;

    // Restart SVG animations whenever this component mounts
    if (typeof svg.unpauseAnimations === "function") {
      svg.unpauseAnimations();
    }

    if (typeof svg.setCurrentTime === "function") {
      svg.setCurrentTime(0);
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
      <defs>
        {/* Invisible motion path shaped exactly like the visible
            orbit ellipse. Electrons travel along this via
            animateMotion, so they stay locked to the true curve. */}
        <path
          id="orbitPath"
          d="M350,200 A150,56 0 1,1 50,200 A150,56 0 1,1 350,200"
        />
      </defs>

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
          <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
            <mpath href="#orbitPath" />
          </animateMotion>
        </circle>

        {/* Electron 2: same path, but its group is rotated 60deg so
            it visually rides the second ring */}
        <g className="orbit-two-group">
          <circle className="atomic-electron" r="7">
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              rotate="auto"
              begin="-2s"
            >
              <mpath href="#orbitPath" />
            </animateMotion>
          </circle>
        </g>

        {/* Electron 3: rotated -60deg, reversed direction */}
        <g className="orbit-three-group">
          <circle className="atomic-electron" r="7">
            <animateMotion
              dur="15s"
              repeatCount="indefinite"
              rotate="auto"
              keyPoints="1;0"
              keyTimes="0;1"
              calcMode="linear"
            >
              <mpath href="#orbitPath" />
            </animateMotion>
          </circle>
        </g>
      </g>

      <circle className="atomic-nucleus" cx="200" cy="200" r="17" />
    </svg>
  );
}
