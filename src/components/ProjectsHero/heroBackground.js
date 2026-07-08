// Background engine for the Projects Hero: subtle floating fireflies
// (same technique as the Impact section's engine) plus a click/tap
// energy burst. One canvas, one animation loop, pauses entirely when
// off-screen, quieter on mobile.

export function startHeroBackground(canvas) {
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
    [0, 224, 255], // electric blue / cyan
    [0, 210, 200], // teal
    [124, 255, 203], // mint
    [155, 107, 255], // soft violet
  ];

  // ---------- Sprite cache: one baked gradient per color ----------
  const SPRITE_SIZE = 140;
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
    if (opacity <= 0.003) return;
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

  // ---------- Fireflies ----------
  const FIREFLY_COUNT = isMobile ? 14 : 26;

  const fireflies = Array.from({ length: FIREFLY_COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: 1.3 + Math.random() * 2,
    glow: 10 + Math.random() * 16,
    speedX: -0.00008 + Math.random() * 0.00016,
    speedY: -0.00012 - Math.random() * 0.0001,
    phase: Math.random() * Math.PI * 2,
    phase2: Math.random() * Math.PI * 2,
    color: randomColor(),
    opacity: (isMobile ? 0.16 : 0.22) + Math.random() * 0.2,
  }));

  function drawFireflies() {
    for (let i = 0; i < fireflies.length; i++) {
      const f = fireflies[i];

      f.x += f.speedX + Math.sin(time * 0.6 + f.phase) * 0.00006;
      f.y += f.speedY + Math.cos(time * 0.5 + f.phase2) * 0.00004;

      if (f.y < -0.06) f.y = 1.06;
      if (f.x < -0.06) f.x = 1.06;
      if (f.x > 1.06) f.x = -0.06;

      const x = f.x * w;
      const y = f.y * h;

      const flicker = 0.65 + Math.sin(time * 1.6 + f.phase) * 0.25;
      const opacity = Math.min(f.opacity * flicker, 0.6);

      drawGlow(x, y, f.glow, f.color, opacity * 0.3);

      ctx.fillStyle = `rgba(${f.color[0]}, ${f.color[1]}, ${f.color[2]}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, f.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ---------- Click / tap energy burst ----------
  const bursts = [];

  function spawnBurst(x, y) {
    const sparkCount = isMobile ? 7 : 10;

    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.3;
      const speed = 0.9 + Math.random() * 1.4;

      bursts.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 8 + Math.random() * 10,
        life: 1,
        color: randomColor(),
      });
    }

    bursts.push({
      x,
      y,
      ring: true,
      radius: 4,
      life: 1,
      color: [0, 224, 255],
    });
  }

  function drawBursts() {
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];

      if (b.ring) {
        b.radius += 5;
        b.life -= 0.05;

        ctx.strokeStyle = `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.94;
        b.vy *= 0.94;
        b.life -= 0.035;

        drawGlow(b.x, b.y, b.radius, b.color, b.life * 0.5);

        ctx.fillStyle = `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.life})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (b.life <= 0) bursts.splice(i, 1);
    }
  }

  function handlePointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;
    spawnBurst(x, y);
  }

  function animate() {
    if (!running) return;

    ctx.clearRect(0, 0, w, h);
    if (!prefersReducedMotion) time += 0.012;

    ctx.globalCompositeOperation = "lighter";
    drawFireflies();
    drawBursts();
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

  const section = canvas.closest(".projects-hero") || canvas.parentElement;
  section.addEventListener("click", handlePointerDown);
  section.addEventListener("touchstart", handlePointerDown, { passive: true });

  let sectionObserver = null;
  let reducedMotionClickHandler = null;

  if (prefersReducedMotion) {
    // One static frame — fireflies visible but not drifting.
    // Bursts are a deliberate user action, so give clicks their own
    // lightweight one-off draw loop that stops once bursts finish.
    drawFireflies();

    reducedMotionClickHandler = () => {
      function drawOnce() {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        drawFireflies();
        drawBursts();
        ctx.globalCompositeOperation = "source-over";

        if (bursts.length > 0) requestAnimationFrame(drawOnce);
      }
      drawOnce();
    };
    section.addEventListener("click", reducedMotionClickHandler);
  } else {
    sectionObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    sectionObserver.observe(section);
  }

  return function cleanup() {
    stop();
    window.removeEventListener("resize", resizeCanvas);
    section.removeEventListener("click", handlePointerDown);
    section.removeEventListener("touchstart", handlePointerDown);
    if (sectionObserver) sectionObserver.disconnect();
    if (reducedMotionClickHandler) {
      section.removeEventListener("click", reducedMotionClickHandler);
    }
  };
}
