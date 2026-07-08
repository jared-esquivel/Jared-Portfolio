export function startContactNetwork(canvas) {
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let w = 0;
  let h = 0;
  let time = 0;
  let rafId = null;
  let running = true;

  const colors = [
    [0, 224, 255],
    [124, 255, 203],
    [47, 155, 255],
    [155, 107, 255],
  ];

  const mouse = { x: -9999, y: -9999, active: false };
  const nodes = [];
  const connections = [];
  const ripples = [];

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = rect.width;
    h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createNetwork();
  }

  function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function drawGlow(x, y, radius, color, opacity) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(
      0,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`,
    );
    gradient.addColorStop(
      0.45,
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.3})`,
    );
    gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function createNetwork() {
    nodes.length = 0;
    connections.length = 0;

    const isMobile = w < 700;
    const count = isMobile ? 14 : 28;

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        phase: Math.random() * Math.PI * 2,
        drift: 2 + Math.random() * 4,
        size: 1.4 + Math.random() * 1.7,
        glow: 10 + Math.random() * 10,
        color: randomColor(),
      });
    }

    for (let i = 0; i < nodes.length; i++) {
      const distances = [];

      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;

        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 240) {
          distances.push({ from: i, to: j, dist });
        }
      }

      distances
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 2)
        .forEach((connection) => {
          if (
            !connections.some(
              (c) =>
                (c.from === connection.from && c.to === connection.to) ||
                (c.from === connection.to && c.to === connection.from),
            )
          ) {
            connections.push({
              ...connection,
              phase: Math.random() * Math.PI * 2,
              pulseOffset: Math.random() * 18,
              pulseSpeed: 10 + Math.random() * 8,
            });
          }
        });
    }
  }

  function getNodePosition(node) {
    const slowX = Math.sin(time * 0.18 + node.phase) * node.drift;
    const slowY = Math.cos(time * 0.14 + node.phase) * node.drift;

    let pushX = 0;
    let pushY = 0;

    if (mouse.active) {
      const dx = node.x - mouse.x;
      const dy = node.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 140 && dist > 1) {
        const force = ((140 - dist) / 140) * 5;
        pushX = (dx / dist) * force;
        pushY = (dy / dist) * force;
      }
    }

    return {
      x: node.x + slowX + pushX,
      y: node.y + slowY + pushY,
    };
  }

  function drawConnections() {
    ctx.lineWidth = 1;

    connections.forEach((connection) => {
      const a = nodes[connection.from];
      const b = nodes[connection.to];

      const posA = getNodePosition(a);
      const posB = getNodePosition(b);

      const breathe = 0.45 + Math.sin(time * 0.25 + connection.phase) * 0.25;
      const opacity = Math.max(0.025, breathe * 0.12);

      ctx.strokeStyle = `rgba(120, 235, 255, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(posA.x, posA.y);
      ctx.lineTo(posB.x, posB.y);
      ctx.stroke();

      const cycle = (time + connection.pulseOffset) % connection.pulseSpeed;

      if (cycle < 1.4) {
        const progress = cycle / 1.4;
        const fade = Math.sin(progress * Math.PI);

        const x = posA.x + (posB.x - posA.x) * progress;
        const y = posA.y + (posB.y - posA.y) * progress;

        drawGlow(x, y, 14, a.color, fade * 0.45);

        ctx.fillStyle = `rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, ${fade})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function drawNodes() {
    nodes.forEach((node) => {
      const pos = getNodePosition(node);
      const breathe = 0.7 + Math.sin(time * 0.35 + node.phase) * 0.2;

      drawGlow(pos.x, pos.y, node.glow, node.color, 0.22 * breathe);

      ctx.fillStyle = `rgba(${node.color[0]}, ${node.color[1]}, ${node.color[2]}, ${0.7 * breathe})`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, node.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];

      ripple.radius += 2.5;
      ripple.life -= 0.025;

      ctx.strokeStyle = `rgba(0, 224, 255, ${ripple.life * 0.35})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.stroke();

      if (ripple.life <= 0) ripples.splice(i, 1);
    }
  }

  function animate() {
    if (!running) return;

    ctx.clearRect(0, 0, w, h);

    if (!reduceMotion) {
      time += 0.01;
    }

    ctx.globalCompositeOperation = "lighter";
    drawConnections();
    drawNodes();
    drawRipples();
    ctx.globalCompositeOperation = "source-over";

    rafId = requestAnimationFrame(animate);
  }

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }

  function handleMouseLeave() {
    mouse.active = false;
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();

    ripples.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      radius: 0,
      life: 1,
    });
  }

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseleave", handleMouseLeave);
  canvas.addEventListener("click", handleClick);

  if (reduceMotion) {
    drawConnections();
    drawNodes();
  } else {
    animate();
  }

  return function cleanup() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);

    window.removeEventListener("resize", resizeCanvas);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseleave", handleMouseLeave);
    canvas.removeEventListener("click", handleClick);
  };
}
