export function startAurora(canvas) {
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let w = 0;
  let h = 0;
  let time = 0;
  let introFinished = false;
  let animationId = null;
  let introTimer = null;
  let scrollFade = 1;

  function updateScrollFade() {
    const scrollY = window.scrollY;
    scrollFade = Math.max(0.35, 1 - scrollY / 900);
  }

  const blobs = [];
  const paintLights = [];
  const ripples = [];

  // Cursor colors
  const colors = [
    [0, 191, 255],
    [0, 255, 230],
    [0, 210, 200],
    [0, 170, 255],
    [150, 255, 180],
    [190, 120, 255],
    [255, 120, 245],
  ];

  // Background aurora colors
  const backgroundColors = [
    [30, 140, 255],
    [0, 225, 235],
    [0, 190, 170],
    [40, 210, 140],
    [150, 170, 255],
    [140, 100, 255],
    [120, 70, 220],
    [210, 90, 220],
    [80, 130, 255],
    [60, 200, 190],
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

  function randomBgColor() {
    return backgroundColors[
      Math.floor(Math.random() * backgroundColors.length)
    ];
  }

  function mixColors(a, b, amount) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * amount),
      Math.round(a[1] + (b[1] - a[1]) * amount),
      Math.round(a[2] + (b[2] - a[2]) * amount),
    ];
  }

  function getCursorColor() {
    const cycleSpeed = time * 0.18;
    const index = Math.floor(cycleSpeed) % colors.length;
    const nextIndex = (index + 1) % colors.length;
    const amount = cycleSpeed - Math.floor(cycleSpeed);

    return mixColors(colors[index], colors[nextIndex], amount);
  }

  function drawGlow(x, y, radius, color, opacity) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(
      0,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`,
    );
    gradient.addColorStop(
      0.3,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.45})`,
    );
    gradient.addColorStop(
      0.65,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.18})`,
    );
    gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function getPointerPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;

    return {
      x: (point.clientX - rect.left) / rect.width,
      y: (point.clientY - rect.top) / rect.height,
    };
  }

  function paintWithLight(e) {
    if (!introFinished || reduceMotion) return;

    const pos = getPointerPosition(e);

    paintLights.push({
      x: pos.x,
      y: pos.y,
      radius: 20 + Math.random() * 30,
      life: 1,
      color: getCursorColor(),
    });

    if (paintLights.length > 55) {
      paintLights.shift();
    }
  }

  function addRipple(e) {
    if (!introFinished || reduceMotion) return;

    const pos = getPointerPosition(e);

    ripples.push({
      x: pos.x,
      y: pos.y,
      radius: 20,
      life: 1,
      color: getCursorColor(),
    });

    if (ripples.length > 8) {
      ripples.shift();
    }
  }

  function drawWaves() {
    ctx.lineWidth = 1.15;

    for (let row = 0; row < 9; row++) {
      const y = (row / 8) * h;
      ctx.beginPath();

      for (let x = 0; x <= w; x += 20) {
        const wave =
          Math.sin(x * 0.006 + time * 1.4 + row * 0.7) * 12 +
          Math.sin(x * 0.012 + time * 0.8 + row) * 5;

        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }

      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(120, 240, 255, 0.18)";
      ctx.strokeStyle = "rgba(120, 240, 255, 0.06)";
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  function drawBackgroundBlobs() {
    blobs.forEach((blob, index) => {
      const driftX =
        Math.sin(time * blob.speed * 120 + blob.phase) * 90 +
        Math.sin(time * blob.speed * 210 + blob.phase2) * 35 +
        Math.cos(time * blob.speed * 70 + blob.phase3) * 45;

      const driftY =
        Math.cos(time * blob.speed * 100 + blob.phase) * 70 +
        Math.sin(time * blob.speed * 180 + blob.phase2) * 40 +
        Math.cos(time * blob.speed * 55 + blob.phase3) * 35;

      const x = blob.x * w + driftX;
      const y = blob.y * h + driftY;
      const breathe = Math.sin(time * 0.45 + index) * 18;

      blob.colorMix += blob.colorSpeed;

      if (blob.colorMix >= 1) {
        blob.color = blob.targetColor;
        blob.targetColor = randomBgColor();
        blob.colorMix = 0;
      }

      const liveColor = mixColors(blob.color, blob.targetColor, blob.colorMix);

      drawGlow(
        x,
        y,
        blob.radius + breathe,
        liveColor,
        blob.opacity * scrollFade,
      );

      drawGlow(
        x,
        y,
        (blob.radius + breathe) * 0.45,
        liveColor,
        blob.opacity * 0.9 * scrollFade,
      );
    });
  }

  function drawPaintLights() {
    for (let i = paintLights.length - 1; i >= 0; i--) {
      const p = paintLights[i];

      drawGlow(
        p.x * w,
        p.y * h,
        p.radius * (2 - p.life * 0.4),
        p.color,
        0.25 * p.life,
      );

      p.life -= 0.012;

      if (p.life <= 0) {
        paintLights.splice(i, 1);
      }
    }
  }

  function drawRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];

      ctx.beginPath();
      ctx.arc(r.x * w, r.y * h, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.color[0]}, ${r.color[1]}, ${r.color[2]}, ${0.35 * r.life})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      r.radius += 2.2;
      r.life -= 0.018;

      if (r.life <= 0) {
        ripples.splice(i, 1);
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    if (reduceMotion) return;

    time += 0.006;

    ctx.globalCompositeOperation = "lighter";
    drawBackgroundBlobs();

    ctx.globalCompositeOperation = "source-over";
    drawWaves();

    ctx.globalCompositeOperation = "lighter";
    drawPaintLights();
    drawRipples();

    animationId = requestAnimationFrame(animate);
  }

  resizeCanvas();

  // Create autonomous glow blobs.
  for (let i = 0; i < 10; i++) {
    blobs.push({
      x: Math.random(),
      y: Math.random(),
      radius: 240 + Math.random() * 290,
      color: randomBgColor(),
      targetColor: randomBgColor(),
      colorMix: 0,
      colorSpeed: 0.0006 + Math.random() * 0.0006,
      phase: Math.random() * Math.PI * 2,
      phase2: Math.random() * Math.PI * 2,
      phase3: Math.random() * Math.PI * 2,
      speed: 0.001 + Math.random() * 0.001,
      opacity: 0.1 + Math.random() * 0.05,
    });
  }

  if (reduceMotion) {
    introFinished = true;
  } else {
    introTimer = window.setTimeout(() => {
      introFinished = true;

      // Soft center ripple when the world opens.
      ripples.push({
        x: 0.5,
        y: 0.5,
        radius: 30,
        life: 1,
        color: [0, 225, 235],
      });
    }, 3700);
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("scroll", updateScrollFade);
  updateScrollFade();
  canvas.addEventListener("mousemove", paintWithLight);
  canvas.addEventListener("touchmove", paintWithLight, { passive: true });
  canvas.addEventListener("touchstart", paintWithLight, { passive: true });
  canvas.addEventListener("click", addRipple);

  animationId = requestAnimationFrame(animate);

  // Cleanup for React unmount / hot reload.
  return () => {
    window.removeEventListener("resize", resizeCanvas);
    canvas.removeEventListener("mousemove", paintWithLight);
    canvas.removeEventListener("touchmove", paintWithLight);
    canvas.removeEventListener("touchstart", paintWithLight);
    canvas.removeEventListener("click", addRipple);
    window.removeEventListener("scroll", updateScrollFade);

    if (introTimer) window.clearTimeout(introTimer);
    if (animationId) cancelAnimationFrame(animationId);
  };
}
