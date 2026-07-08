// A minimal, quiet particle field for the Leadership section: tiny
// floating motes with occasional soft colored sparks. Deliberately
// simpler than the Hero/Impact canvases — this should support the
// accordion, never compete with it.

export function startSparksBackground(canvas) {
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let w = 0;
  let h = 0;
  let time = 0;
  let running = false;
  let rafId = null;

  const colors = [
    [0, 224, 255],
    [124, 255, 203],
    [47, 155, 255],
    [166, 107, 255],
  ];

  const SPRITE_SIZE = 100;
  const spriteCache = new Map();

  function getSprite(color) {
    const key = color.join(",");
    if (spriteCache.has(key)) return spriteCache.get(key);

    const off = document.createElement("canvas");
    off.width = SPRITE_SIZE;
    off.height = SPRITE_SIZE;
    const octx = off.getContext("2d");
    const r = SPRITE_SIZE / 2;

    const gradient = octx.createRadialGradient(r, r, 0, r, r, r);
    gradient.addColorStop(
      0,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.9)`,
    );
    gradient.addColorStop(
      0.4,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.25)`,
    );
    gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

    octx.fillStyle = gradient;
    octx.beginPath();
    octx.arc(r, r, r, 0, Math.PI * 2);
    octx.fill();

    spriteCache.set(key, off);
    return off;
  }

  function drawGlow(x, y, radius, color, opacity) {
    if (opacity <= 0.003) return;
    const sprite = getSprite(color);
    const size = radius * 2;
    ctx.globalAlpha = opacity;
    ctx.drawImage(sprite, x - radius, y - radius, size, size);
    ctx.globalAlpha = 1;
  }

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

  const MOTE_COUNT = isMobile ? 16 : 28;
  const motes = Array.from({ length: MOTE_COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 1 + Math.random() * 1.4,
    speedY: -0.00006 - Math.random() * 0.00006,
    phase: Math.random() * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 0.12 + Math.random() * 0.16,
  }));

  // Occasional soft spark: a slightly brighter mote that flares once
  // and fades, on a long randomized interval — not synced, not
  // frequent.
  let nextSparkAt = 4 + Math.random() * 6;
  const sparks = [];

  function drawMotes() {
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      m.y += m.speedY;
      const wobbleX = Math.sin(time * 0.3 + m.phase) * 0.003;
      if (m.y < -0.05) m.y = 1.05;

      const x = (m.x + wobbleX) * w;
      const y = m.y * h;
      const flicker = 0.7 + Math.sin(time * 0.8 + m.phase) * 0.3;
      const opacity = m.opacity * flicker;

      drawGlow(x, y, m.size * 6, m.color, opacity * 0.4);
      ctx.fillStyle = `rgba(${m.color[0]}, ${m.color[1]}, ${m.color[2]}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, m.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function maybeSpawnSpark() {
    if (time < nextSparkAt) return;
    nextSparkAt = time + 5 + Math.random() * 7;

    sparks.push({
      x: Math.random() * w,
      y: Math.random() * h,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
    });
  }

  function drawSparks() {
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life -= 0.012;
      drawGlow(s.x, s.y, 22 * (1 - s.life * 0.3), s.color, s.life * 0.35);
      if (s.life <= 0) sparks.splice(i, 1);
    }
  }

  function animate() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    if (!prefersReducedMotion) time += 0.01;

    ctx.globalCompositeOperation = "lighter";
    drawMotes();
    maybeSpawnSpark();
    drawSparks();
    ctx.globalCompositeOperation = "source-over";

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

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  if (prefersReducedMotion) {
    drawMotes(); // one static frame, no loop
    return function cleanup() {
      window.removeEventListener("resize", resizeCanvas);
    };
  }

  const section = canvas.closest(".leadership-section") || canvas.parentElement;
  const observer = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0 },
  );
  observer.observe(section);

  return function cleanup() {
    stop();
    observer.disconnect();
    window.removeEventListener("resize", resizeCanvas);
  };
}
