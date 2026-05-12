import React, { useEffect, useRef } from 'react';

interface CanvasVisualizerProps {
  frequency: Uint8Array | null;
  waveform: Uint8Array | null;
  isPlaying: boolean;
  themeColor?: string;
  bassFrequency: number;
  midFrequency: number;
  trebleFrequency: number;
  averageFrequency: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface Blob {
  x: number;
  y: number;
  radius: number;
  targetRadius: number;
  color: string;
  rotation: number;
}

export const CanvasVisualizer: React.FC<CanvasVisualizerProps> = ({
  frequency,
  waveform,
  isPlaying,
  themeColor,
  bassFrequency,
  midFrequency,
  trebleFrequency,
  averageFrequency,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const blobsRef = useRef<Blob[]>([]);
  const smoothedFrequencyRef = useRef<number[]>([]);
  const timeRef = useRef<number>(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(t, 1);

  const drawOrganicVisualization = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    if (!frequency) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const dataLength = frequency.length;
    const time = timeRef.current;

    // Initialize smoothed frequency
    if (smoothedFrequencyRef.current.length === 0) {
      smoothedFrequencyRef.current = Array(dataLength).fill(0);
    }

    // Smooth frequency data
    const smoothingFactor = 0.75;
    for (let i = 0; i < dataLength; i++) {
      smoothedFrequencyRef.current[i] = lerp(
        smoothedFrequencyRef.current[i],
        frequency[i],
        1 - smoothingFactor
      );
    }

    // Draw radial frequency visualization with organic distortion
    const numRings = 12;
    const maxRadius = Math.min(width, height) / 2.2;

    for (let ring = 0; ring < numRings; ring++) {
      const ringRadius = (maxRadius / numRings) * (ring + 1);
      const dataIndex = Math.floor((ring / numRings) * dataLength);
      const frequencyValue = smoothedFrequencyRef.current[dataIndex] / 255;

      // Create organic distortion
      const distortion = frequencyValue * ringRadius * 0.35;
      const waveFrequency = 2 + ring * 0.3;

      ctx.beginPath();
      let isFirst = true;

      for (let angle = 0; angle < Math.PI * 2; angle += 0.04) {
        // Multi-layered waviness for organic feel
        const wave1 = Math.sin(angle * waveFrequency + time * 0.003) * distortion;
        const wave2 = Math.cos(angle * (waveFrequency + 1) + time * 0.002) * distortion * 0.5;
        const waveAmount = wave1 + wave2;

        const radius = ringRadius + waveAmount;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (isFirst) {
          ctx.moveTo(x, y);
          isFirst = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      // Dynamic color based on frequency
      const hue = 260 + frequencyValue * 40;
      const saturation = 12 + frequencyValue * 15;
      const lightness = 45 + frequencyValue * 25;

      ctx.strokeStyle = `oklch(${(lightness / 100).toFixed(3)} ${(saturation / 100).toFixed(3)} ${hue.toFixed(1)})`;
      ctx.lineWidth = 1.5 + frequencyValue * 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // Draw flowing center spiral
    ctx.beginPath();
    const spiralPoints = 128;
    for (let i = 0; i < spiralPoints; i++) {
      const t = i / spiralPoints;
      const freqIndex = Math.floor(t * dataLength);
      const freq = smoothedFrequencyRef.current[freqIndex] / 255;

      const angle = t * Math.PI * 4 + time * 0.001;
      const radius = maxRadius * 0.4 + freq * maxRadius * 0.35;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    const avgFreq = averageFrequency / 255;
    ctx.strokeStyle = `oklch(${(0.35 + avgFreq * 0.25).toFixed(3)} ${(0.12 + avgFreq * 0.1).toFixed(3)} 260 / 0.15)`;
    ctx.lineWidth = 2 + avgFreq * 3;
    ctx.stroke();

    // Draw gradient fill for depth
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    const innerAlpha = 0.05 + avgFreq * 0.1;
    const outerAlpha = 0.02;
    gradient.addColorStop(0, `oklch(0.4 0.15 260 / ${innerAlpha})`);
    gradient.addColorStop(1, `oklch(0.2 0.05 260 / ${outerAlpha})`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.fill();

    // Emit particles on bass hits with more energy
    if (bassFrequency > 90) {
      const particleCount = Math.floor(bassFrequency / 40);
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.3;
        const speed = 2.5 + Math.random() * 5;
        const hue = 260 + Math.random() * 50;

        particlesRef.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          size: 3 + Math.random() * 6,
          color: `oklch(0.65 0.18 ${hue})`,
        });
      }
    }

    // Update and draw particles with trails
    particlesRef.current = particlesRef.current.filter((p) => {
      p.life -= 0.015;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // Gravity
      p.vx *= 0.98; // Air resistance

      if (p.life > 0) {
        const opacity = p.life * p.life; // Ease out
        ctx.globalAlpha = opacity * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle trail
        ctx.globalAlpha = opacity * 0.3;
        ctx.beginPath();
        ctx.arc(p.x - p.vx * 0.5, p.y - p.vy * 0.5, p.size * p.life * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        return true;
      }
      return false;
    });

    // Draw subtle background glow
    ctx.globalAlpha = 0.05 + avgFreq * 0.05;
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 1.5);
    glowGradient.addColorStop(0, 'oklch(0.6 0.2 260)');
    glowGradient.addColorStop(1, 'oklch(0.1 0 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      timeRef.current += 1;

      // Clear canvas with deep navy background
      ctx.fillStyle = 'oklch(0.08 0.01 260)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying && frequency) {
        drawOrganicVisualization(ctx, canvas.width, canvas.height);
      } else {
        // Idle animation with subtle breathing effect
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const time = Date.now() * 0.0003;
        const breathe = Math.sin(time) * 0.3 + 0.7;

        ctx.strokeStyle = 'oklch(0.25 0.08 260)';
        ctx.lineWidth = 1.5;

        for (let i = 0; i < 4; i++) {
          const radius = (50 + i * 35) * breathe;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Idle particles
        if (Math.random() < 0.02) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 80 + Math.random() * 40;
          particlesRef.current.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            vx: Math.cos(angle) * 0.5,
            vy: Math.sin(angle) * 0.5,
            life: 1,
            maxLife: 1,
            size: 1 + Math.random() * 2,
            color: 'oklch(0.5 0.12 260)',
          });
        }

        // Draw idle particles
        particlesRef.current = particlesRef.current.filter((p) => {
          p.life -= 0.01;
          p.x += p.vx;
          p.y += p.vy;

          if (p.life > 0) {
            ctx.globalAlpha = p.life * 0.5;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            return true;
          }
          return false;
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, frequency, averageFrequency, bassFrequency]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
};
