import { useEffect, useRef, useState } from "react";

const NODES = [
  [3, 18, 0],
  [11, 7, 0.12],
  [21, 28, 0.28],
  [32, 11, 0.08],
  [43, 31, 0.36],
  [56, 9, 0.2],
  [69, 27, 0.44],
  [82, 10, 0.16],
  [96, 29, 0.32],
  [5, 67, 0.4],
  [17, 87, 0.18],
  [29, 60, 0.5],
  [42, 83, 0.1],
  [55, 63, 0.3],
  [68, 89, 0.46],
  [80, 62, 0.22],
  [94, 84, 0.38],
];

export default function KineticStatement() {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);
  const hoverEnterTimerRef = useRef(null);
  const hoverExitTimerRef = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(hoverEnterTimerRef.current);
      clearTimeout(hoverExitTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!isActive) return;

    const closeOnOutsidePress = (event) => {
      if (!buttonRef.current?.contains(event.target)) setIsActive(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [isActive]);

  return (
    <h1 className="story-statement">
      <button
        ref={buttonRef}
        type="button"
        className={
          "kinetic-statement" +
          (isActive ? " is-active" : "") +
          (isHovered ? " is-hovered" : "")
        }
        aria-label="Built to Innovate. Ready to Lead."
        aria-pressed={isActive}
        onClick={(event) => {
          const isDesktopPointer = window.matchMedia(
            "(hover: hover) and (pointer: fine)",
          ).matches;

          // Mouse users get the effect only while hovering. Keep toggle
          // behavior for touch and keyboard users, who have no hover state.
          if (isDesktopPointer && event.detail > 0) return;
          setIsActive((active) => !active);
        }}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          clearTimeout(hoverEnterTimerRef.current);
          clearTimeout(hoverExitTimerRef.current);
          hoverEnterTimerRef.current = setTimeout(() => {
            setIsHovered(true);
          }, 120);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          clearTimeout(hoverEnterTimerRef.current);
          clearTimeout(hoverExitTimerRef.current);
          hoverExitTimerRef.current = setTimeout(() => {
            setIsHovered(false);
          }, 180);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsActive(false);
            event.currentTarget.blur();
          }
        }}
      >
        <span className="kinetic-line">
          <span className="kinetic-solid">Built to Innovate.</span>
          <span className="kinetic-outline" aria-hidden="true">
            Built to Innovate.
          </span>
        </span>
        <span className="kinetic-line kinetic-line--accent">
          <span className="kinetic-solid">Ready to Lead.</span>
          <span className="kinetic-outline" aria-hidden="true">
            Ready to Lead.
          </span>
        </span>

        <span className="kinetic-nodes" aria-hidden="true">
          {NODES.map(([x, y, delay], index) => (
            <span
              className="kinetic-node"
              key={`${x}-${y}`}
              style={{
                "--node-x": `${x}%`,
                "--node-y": `${y}%`,
                "--node-delay": `${delay}s`,
                "--node-shift": index % 2 === 0 ? "0.14em" : "-0.14em",
              }}
            />
          ))}
        </span>
      </button>
    </h1>
  );
}
