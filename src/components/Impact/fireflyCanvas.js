// Same optimized firefly engine as before, just exported as a
// startFireflies(canvas) function so React can own its lifecycle —
// same pattern as your existing auroraCanvas.js / startAurora().

export function startFireflies(canvas) {
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

  const mouse = { x: -9999, y: -9999 };
  const sparks = [];

  const colors = [
    [0, 224, 255],
    [0, 210, 200],
    [124, 255, 203],
    [47, 155, 255],
    [155, 107, 255],
  ];

  // ---------- Sprite cache: one baked gradient per color ----------
  const SPRITE_SIZE = 160;
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
    gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`);
    gradient.addColorStop(
      0.35,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.35)`,
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
    if (opacity <= 0.002) return;
    const sprite = getSprite(color);
    const size = radius * 2;

    ctx.globalAlpha = opacity;
    ctx.drawImage(sprite, x - radius, y - radius, size, size);
    ctx.globalAlpha = 1;
  }

  function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
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

  const fireflies = Array.from({ length: 34 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 1.5 + Math.random() * 2.6,
    glow: 12 + Math.random() * 22,
    speedX: -0.0001 + Math.random() * 0.0002,
    speedY: -0.00014 - Math.random() * 0.00012,
    phase: Math.random() * Math.PI * 2,
    phase2: Math.random() * Math.PI * 2,
    color: randomColor(),
    opacity: 0.24 + Math.random() * 0.3,
  }));

  function drawFireflies() {
    for (let i = 0; i < fireflies.length; i++) {
      const f = fireflies[i];

      f.x += f.speedX + Math.sin(time * 0.7 + f.phase) * 0.00008;
      f.y += f.speedY + Math.cos(time * 0.6 + f.phase2) * 0.00005;

      if (f.y < -0.08) f.y = 1.08;
      if (f.x < -0.08) f.x = 1.08;
      if (f.x > 1.08) f.x = -0.08;

      const x = f.x * w;
      const y = f.y * h;

      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nearMouse = dist < 120;

      const flicker = 0.65 + Math.sin(time * 2.1 + f.phase) * 0.25;
      const mouseBoost = nearMouse ? 0.26 : 0;
      const opacity = Math.min(f.opacity * flicker + mouseBoost, 0.78);

      drawGlow(
        x,
        y,
        f.glow + Math.sin(time + f.phase) * 3,
        f.color,
        opacity * 0.34,
      );

      ctx.fillStyle = `rgba(${f.color[0]}, ${f.color[1]}, ${f.color[2]}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, f.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawSparks() {
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];

      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.018;

      drawGlow(s.x, s.y, s.radius, s.color, s.life * 0.42);

      if (s.life <= 0) sparks.splice(i, 1);
    }
  }

  function addSparkRipple(e) {
    const point = e.touches ? e.touches[0] : e;
    addSparkBurstAt(point.clientX, point.clientY);
  }

  function addSparkBurstAt(clientX, clientY) {
    if (prefersReducedMotion) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14;
      const speed = 0.8 + Math.random() * 1.6;

      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 12 + Math.random() * 16,
        life: 1,
        color: randomColor(),
      });
    }
  }

  function updateMouse(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    mouse.x = point.clientX - rect.left;
    mouse.y = point.clientY - rect.top;
  }

  function animate() {
    if (!running) return;

    ctx.clearRect(0, 0, w, h);
    if (!prefersReducedMotion) time += 0.01;

    ctx.globalCompositeOperation = "lighter";
    drawFireflies();
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

  const section = canvas.closest(".impact-section") || canvas.parentElement;

  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("mousemove", updateMouse);
  canvas.addEventListener("touchmove", updateMouse, { passive: true });

  if (section) {
    section.addEventListener("click", addSparkRipple);
    section.addEventListener("touchstart", addSparkRipple, { passive: true });
  }

  // Pause entirely while the section is off-screen
  const sectionObserver = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0 },
  );

  if (section) sectionObserver.observe(section);
  else start();

  return function cleanup() {
    stop();
    sectionObserver.disconnect();

    window.removeEventListener("resize", resizeCanvas);
    canvas.removeEventListener("mousemove", updateMouse);
    canvas.removeEventListener("touchmove", updateMouse);

    if (section) {
      section.removeEventListener("click", addSparkRipple);
      section.removeEventListener("touchstart", addSparkRipple);
    }
  };
}
