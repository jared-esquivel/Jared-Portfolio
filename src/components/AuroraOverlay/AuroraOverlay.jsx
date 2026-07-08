import "./AuroraOverlay.css";

// AuroraOverlay: purely decorative, purely CSS-animated background.
// Two kinds of shapes work together to sell the "real aurora" look:
//
// 1. Arcs — large, wide, asymmetrically-rounded bands that curve like
//    a real aurora sweeping across the sky (not flat rectangular bars).
// 2. Curtains — thin vertical light beams layered on top of the arcs,
//    giving that "hanging light curtain" texture real auroras have.
//
// Everything here is transform/opacity driven, so it stays cheap and
// GPU-accelerated. No state, no JS animation loop.
export default function AuroraOverlay() {
  return (
    <div className="aurora-overlay" aria-hidden="true">
      {/* Wide curved arcs — the big shapes that establish the aurora's
          overall form and color depth */}
      <div className="aurora-arc aurora-arc--1" />
      <div className="aurora-arc aurora-arc--2" />
      <div className="aurora-arc aurora-arc--3" />

      {/* Vertical curtain beams layered on top, for the "hanging light
          curtain" texture. Grouped in their own wrapper so they can
          share one mask/fade without affecting the arcs. */}
      <div className="aurora-curtains">
        <span className="aurora-curtain aurora-curtain--1" />
        <span className="aurora-curtain aurora-curtain--2" />
        <span className="aurora-curtain aurora-curtain--3" />
        <span className="aurora-curtain aurora-curtain--4" />
        <span className="aurora-curtain aurora-curtain--5" />
      </div>
    </div>
  );
}
