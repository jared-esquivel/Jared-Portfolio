// A minimal, luxurious background of 3–5 large blurred wave ribbons
// drifting slowly beneath the surface — no particles, no nodes, no
// cursor interaction. Each ribbon is an organic blobby shape (built
// from bezier curves, not a sine function) filled with a soft
// low-opacity gradient, then blurred via canvas's native filter.
//
// Movement is just two things per ribbon: a slow horizontal drift
// and a slow "breathe" (vertical scale + opacity pulse), each on its
// own long, non-round-number cycle so ribbons never sync up or
// repeat in an obviously mechanical way.

export function startWaveBackground(canvas) {
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let w = 0;
  let h = 0;
  let time = 0;
  let running = false;
  let rafId = null;

  // Palette: electric cyan, teal, deep blue, soft violet — kept to
  // very low opacity per the brief (~3-8%).
  const RIBBONS = [
    {
      color: [0, 224, 255], // electric cyan
      baseOpacity: 0.06,
      yFraction: 0.28, // vertical position as a fraction of section height
      heightFraction: 0.34,
      driftDuration: 34, // seconds for one full horizontal drift cycle
      breatheDuration: 21,
      driftPhase: 0,
      breathePhase: 1.1,
    },
    {
      color: [26, 120, 220], // deep blue
      baseOpacity: 0.05,
      yFraction: 0.48,
      heightFraction: 0.4,
      driftDuration: 41,
      breatheDuration: 27,
      driftPhase: 2.4,
      breathePhase: 0.4,
    },
    {
      color: [0, 180, 170], // teal
      baseOpacity: 0.055,
      yFraction: 0.62,
      heightFraction: 0.3,
      driftDuration: 29,
      breatheDuration: 19,
      driftPhase: 4.1,
      breathePhase: 2.8,
    },
    {
      color: [140, 100, 220], // soft violet
      baseOpacity: 0.045,
      yFraction: 0.78,
      heightFraction: 0.32,
      driftDuration: 37,
      breatheDuration: 24,
      driftPhase: 1.6,
      breathePhase: 3.5,
    },
  ];

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Draws one ribbon as an organic blobby band: a smooth top edge
  // and a smooth bottom edge, each built from a handful of bezier
  // control points whose y-offsets drift slowly over time — this is
  // what gives "gently reshaping" rather than "sliding sine wave."
  function drawRibbon(ribbon, t) {
    const driftProgress = (t / ribbon.driftDuration + ribbon.driftPhase) % 1;
    // Horizontal drift: eased back and forth rather than a hard loop,
    // using a sine so it reverses smoothly instead of jumping
    const driftX = Math.sin(driftProgress * Math.PI * 2) * w * 0.08;

    const breatheProgress =
      Math.sin(
        (t / ribbon.breatheDuration) * Math.PI * 2 + ribbon.breathePhase,
      ) *
        0.5 +
      0.5; // 0..1
    const breatheScale = 0.9 + breatheProgress * 0.2; // subtle vertical breathing
    const opacity = ribbon.baseOpacity * (0.75 + breatheProgress * 0.25);

    const centerY = h * ribbon.yFraction;
    const bandHeight = h * ribbon.heightFraction * breatheScale;
    const topY = centerY - bandHeight / 2;
    const bottomY = centerY + bandHeight / 2;

    // A handful of control points across the width, each with its own
    // slow independent wobble so the curve reshapes organically
    const points = 5;
    const topPoints = [];
    const bottomPoints = [];

    for (let i = 0; i <= points; i++) {
      const x = (w / points) * i + driftX;
      const wobbleSeed = i * 1.7 + ribbon.driftPhase * 3;
      const topWobble = Math.sin(t * 0.05 + wobbleSeed) * bandHeight * 0.18;
      const bottomWobble =
        Math.sin(t * 0.045 + wobbleSeed + 1.3) * bandHeight * 0.18;

      topPoints.push({ x, y: topY + topWobble });
      bottomPoints.push({ x, y: bottomY + bottomWobble });
    }

    ctx.save();
    ctx.filter = "blur(70px)"; // heavy blur — soft edges, "liquid light" not a shape

    ctx.beginPath();
    ctx.moveTo(topPoints[0].x - w * 0.15, topPoints[0].y);

    for (let i = 0; i < topPoints.length - 1; i++) {
      const p0 = topPoints[i];
      const p1 = topPoints[i + 1];
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
    }
    ctx.lineTo(
      topPoints[topPoints.length - 1].x + w * 0.15,
      topPoints[topPoints.length - 1].y,
    );

    ctx.lineTo(
      bottomPoints[bottomPoints.length - 1].x + w * 0.15,
      bottomPoints[bottomPoints.length - 1].y,
    );

    for (let i = bottomPoints.length - 1; i > 0; i--) {
      const p0 = bottomPoints[i];
      const p1 = bottomPoints[i - 1];
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
    }
    ctx.lineTo(bottomPoints[0].x - w * 0.15, bottomPoints[0].y);

    ctx.closePath();

    // Soft gradient fill across the ribbon's width — brighter toward
    // the center, fading at both ends, so it reads as a glowing band
    // rather than a flat-filled shape
    const [r, g, b] = ribbon.color;
    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
    gradient.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${opacity})`);
    gradient.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${opacity})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }

  function drawFrame(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter"; // overlapping ribbons brighten softly rather than muddy
    for (let i = 0; i < RIBBONS.length; i++) {
      drawRibbon(RIBBONS[i], t);
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function animate() {
    if (!running) return;
    time += 1 / 60; // roughly one unit of "t" per frame at 60fps
    drawFrame(time);
    rafId = requestAnimationFrame(animate);
  }

  function start() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(animate);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function handleResize() {
    resizeCanvas();
    if (prefersReducedMotion) drawFrame(time); // redraw the static frame at new size
  }

  resizeCanvas();
  window.addEventListener("resize", handleResize);

  if (prefersReducedMotion) {
    // One calm static frame, no animation loop at all
    drawFrame(0);
  } else {
    const section = canvas.closest(".recognition") || canvas.parentElement;
    const sectionObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    if (section) sectionObserver.observe(section);
    else start();

    return function cleanup() {
      stop();
      sectionObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }

  // Reduced-motion cleanup path (no observer was created)
  return function cleanup() {
    window.removeEventListener("resize", handleResize);
  };
}
