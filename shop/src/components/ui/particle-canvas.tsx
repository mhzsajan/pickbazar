import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  phase: number;
}

interface Streak {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  length: number;
  color: string;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<Orb[]>([]);
  const streaksRef = useRef<Streak[]>([]);
  const frameRef = useRef(0);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particleCount = Math.min(
        180,
        Math.max(60, Math.floor((canvas.width * canvas.height) / 12000))
      );
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.2 + 0.8,
          alpha: Math.random() * 0.35 + 0.25,
        });
      }
      particlesRef.current = particles;

      const orbColors = [
        '80, 60, 180', '40, 80, 160', '100, 50, 140',
        '180, 60, 120', '60, 100, 180', '120, 50, 160',
        '50, 90, 140', '150, 60, 100',
      ];
      const orbs: Orb[] = [];
      for (let i = 0; i < 8; i++) {
        const r = Math.random() * 250 + 150;
        const margin = r;
        orbs.push({
          x: margin + Math.random() * (canvas.width - margin * 2),
          y: margin + Math.random() * (canvas.height - margin * 2),
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: r,
          color: orbColors[i % orbColors.length],
          alpha: Math.random() * 0.12 + 0.08,
          pulseSpeed: Math.random() * 0.005 + 0.003,
          phase: Math.random() * Math.PI * 2,
        });
      }
      orbsRef.current = orbs;
    };

    const spawnStreak = (burst = false) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 4;
      const side = Math.floor(Math.random() * 4);
      let x: number, y: number;
      switch (side) {
        case 0: x = -50; y = Math.random() * canvas.height; break;
        case 1: x = canvas.width + 50; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = -50; break;
        default: x = Math.random() * canvas.width; y = canvas.height + 50;
      }
      const streakColors = [
        '255, 50, 50', '255, 150, 0', '255, 220, 50',
        '150, 255, 50', '50, 255, 100', '50, 255, 255',
        '50, 150, 255', '100, 50, 255', '200, 50, 255', '255, 50, 150',
      ];
      const count = burst ? 2 + Math.floor(Math.random() * 2) : 1;
      for (let b = 0; b < count; b++) {
        const offsetAngle = burst ? (Math.random() - 0.5) * 0.6 : 0;
        streaksRef.current.push({
          x: x + (Math.random() - 0.5) * 60,
          y: y + (Math.random() - 0.5) * 60,
          vx: Math.cos(angle + offsetAngle) * (speed + Math.random() * 2),
          vy: Math.sin(angle + offsetAngle) * (speed + Math.random() * 2),
          life: 1,
          length: Math.random() * 50 + 40,
          color: streakColors[Math.floor(Math.random() * streakColors.length)],
        });
      }
    };

    const animate = (time: number) => {
      frameRef.current = requestAnimationFrame(animate);
      if (!isVisible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const orbs = orbsRef.current;
      const streaks = streaksRef.current;
      const mouse = mouseRef.current;

      // --- Ambient orbs ---
      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.radius || o.x > canvas.width + o.radius) o.vx *= -1;
        if (o.y < -o.radius || o.y > canvas.height + o.radius) o.vy *= -1;

        const pulse = Math.sin(time * o.pulseSpeed + o.phase) * 0.3 + 0.7;
        const currentAlpha = o.alpha * pulse;
        const gradient = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.radius);
        gradient.addColorStop(0, `rgba(${o.color}, ${currentAlpha})`);
        gradient.addColorStop(0.4, `rgba(${o.color}, ${currentAlpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${o.color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(o.x - o.radius, o.y - o.radius, o.radius * 2, o.radius * 2);
      }

      // --- Constellation particles ---
      const maxSpeed = 1.2;
      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250 && dist > 0) {
          const force = (250 - dist) / 250;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        }
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;
      }

      const isDark = document.documentElement.classList.contains('dark');
      const lineColor = isDark ? '140, 180, 255' : '70, 90, 180';
      const dotColor = isDark ? '200, 220, 255' : '50, 70, 160';

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.strokeStyle = `rgba(${lineColor}, ${(1 - dist / 180) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgba(${dotColor}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Shooting stars ---
      if (time - lastSpawnRef.current > Math.random() * 1000 + 500) {
        spawnStreak(Math.random() < 0.3);
        lastSpawnRef.current = time;
      }

      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.006;
        s.vx *= 0.99;
        s.vy *= 0.99;

        if (s.life <= 0 || s.x < -200 || s.x > canvas.width + 200 || s.y < -200 || s.y > canvas.height + 200) {
          streaks.splice(i, 1);
          continue;
        }

        const headAlpha = Math.min(s.life * 2, 1);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        const segments = 8;
        for (let j = 1; j <= segments; j++) {
          const t = j / segments;
          const tx = s.x - s.vx * t * s.length / 3;
          const ty = s.y - s.vy * t * s.length / 3;
          ctx.lineTo(tx, ty);
        }
        ctx.strokeStyle = `rgba(${s.color}, ${headAlpha * 0.4})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        for (let j = 1; j <= 3; j++) {
          const t = j / 3;
          const tx = s.x - s.vx * t * s.length / 6;
          const ty = s.y - s.vy * t * s.length / 6;
          ctx.lineTo(tx, ty);
        }
        ctx.strokeStyle = `rgba(${s.color}, ${headAlpha * 0.9})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = `rgba(${s.color}, ${headAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    animate(0);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
