"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Pulse {
  x: number;
  direction: 1 | -1; // 1 = left to center, -1 = right to center
  speed: number;
  length: number;
  channelIndex: number;
  width: number;
  alpha: number;
}

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mouse coords relative to screen center (-0.5 to 0.5)
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current = {
        x: (e.clientX / innerWidth) - 0.5,
        y: (e.clientY / innerHeight) - 0.5,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = containerRef.current?.clientWidth || 580);
    let height = (canvas.height = containerRef.current?.clientHeight || 580);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Keep 1:1 aspect ratio square sizing
        const size = Math.min(entry.contentRect.width, entry.contentRect.height) || 580;
        width = canvas.width = size;
        height = canvas.height = size;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // State variables
    let logoGlowSurge = 0;
    let particles: Particle[] = [];
    const pulses: Pulse[] = [];
    
    // Exact horizontal channel positions relative to image height in agolden.png
    // The lines are spaced 16% apart starting from 8.5%
    const channelFractions = [0.085, 0.245, 0.405, 0.565, 0.725, 0.885];

    let lastPulseSpawn = 0;

    const spawnPulse = () => {
      const channelIndex = Math.floor(Math.random() * channelFractions.length);
      const direction = Math.random() > 0.5 ? 1 : -1;
      const speed = 1.8 + Math.random() * 2.2;
      const length = 35 + Math.random() * 45;
      const widthPulse = 1.5 + Math.random() * 1.5;

      pulses.push({
        x: direction === 1 ? -50 : width + 50,
        direction,
        speed,
        length,
        channelIndex,
        width: widthPulse,
        alpha: 1,
      });
    };

    // Initialize initial pulses
    for (let i = 0; i < 3; i++) {
      spawnPulse();
      if (pulses[i]) {
        pulses[i].x = Math.random() * width;
      }
    }

    const render = () => {
      // Smooth mouse movement interpolation
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.08;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.08;

      const sx = smoothMouseRef.current.x;
      const sy = smoothMouseRef.current.y;

      // Clear the transparent overlay canvas
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Move and Draw Gold Neon Energy Pulses along the channels
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      if (Date.now() - lastPulseSpawn > 1400 + Math.random() * 1200) {
        spawnPulse();
        lastPulseSpawn = Date.now();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        // Calculate y coordinate based on current height
        const y = height * channelFractions[p.channelIndex];

        // Move pulse toward center
        if (p.direction === 1) {
          p.x += p.speed;
        } else {
          p.x -= p.speed;
        }

        // Draw dynamic 3D drop shadow of the pulse to make it "float" above the channel
        const shadowX = -sx * 10;
        const shadowY = -sy * 10 + 3;

        ctx.strokeStyle = `rgba(0, 0, 0, ${0.4 * p.alpha})`;
        ctx.lineWidth = p.width + 2;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.moveTo(p.x - (p.direction * p.length) + shadowX, y + shadowY);
        ctx.lineTo(p.x + shadowX, y + shadowY);
        ctx.stroke();

        // Now draw the glowing gold neon pulse itself (hovering 3D effect)
        const pulseGrad = ctx.createLinearGradient(
          p.x - (p.direction * p.length),
          y - 2,
          p.x,
          y - 2
        );
        pulseGrad.addColorStop(0, "rgba(212, 175, 55, 0)");
        pulseGrad.addColorStop(0.5, `rgba(212, 175, 55, ${0.7 * p.alpha})`);
        pulseGrad.addColorStop(1, `rgba(255, 230, 130, ${p.alpha})`);

        ctx.strokeStyle = pulseGrad;
        ctx.lineWidth = p.width;
        ctx.shadowColor = "#D4AF37";
        ctx.shadowBlur = 10 + logoGlowSurge * 4;

        ctx.beginPath();
        ctx.moveTo(p.x - (p.direction * p.length), y - 2);
        ctx.lineTo(p.x, y - 2);
        ctx.stroke();

        // Check if pulse has reached the core area (titanium frame edge or logo center)
        const distToCenter = Math.abs(p.x - cx);
        
        // The titanium frame is centered and spans roughly 42% radius (i.e. x from 15% to 85%)
        // When pulses get close to the core area (within 130px of center)
        if (distToCenter < 140) {
          // Slowly fade out the pulse as it enters the titanium core
          p.alpha -= 0.08;
          
          if (p.alpha <= 0 || distToCenter < 90) {
            // Trigger logo glow surge
            logoGlowSurge = Math.min(1.2, logoGlowSurge + 0.28);

            // Spawn subtle gold particles radiating outwards from the central logo
            const particleCount = 4 + Math.floor(Math.random() * 4);
            for (let k = 0; k < particleCount; k++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 1.0 + Math.random() * 2.0;
              particles.push({
                x: cx + (Math.random() - 0.5) * 30,
                y: cy + (Math.random() - 0.5) * 30,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 1 + Math.random() * 1.5,
                color: Math.random() > 0.4 ? "#D4AF37" : "#FFF5D1",
                alpha: 1,
                life: 0,
                maxLife: 35 + Math.random() * 25,
              });
            }
            pulses.splice(i, 1);
          }
        }
      }
      ctx.restore();

      // 2. Draw Subtle Gold Spark Particles around the central logo core
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.life++;

        // Apply friction
        pt.vx *= 0.96;
        pt.vy *= 0.96;

        pt.x += pt.vx;
        pt.y += pt.vy;
        
        pt.alpha = 1 - (pt.life / pt.maxLife);

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha * 0.9;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 4;
        
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();

        if (pt.life >= pt.maxLife) {
          particles.splice(i, 1);
        }
      }
      ctx.restore();

      // 3. Draw a glowing gold core overlay directly on top of the logo
      // This increases the image's logo glow intensity in response to pulses hitting it
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      
      const logoGlowRadius = 75 + logoGlowSurge * 55;
      const logoGlowOpacity = 0.12 + logoGlowSurge * 0.38;

      const logoGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, logoGlowRadius);
      logoGlow.addColorStop(0, `rgba(212, 175, 55, ${logoGlowOpacity})`);
      logoGlow.addColorStop(0.5, `rgba(168, 112, 25, ${logoGlowOpacity * 0.4})`);
      logoGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = logoGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, logoGlowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Metallic edge gleam/reflection overlay that moves with mouse parallax
      const gleamX = cx + sx * 60;
      const gleamY = cy + sy * 60;
      const gleamGrad = ctx.createRadialGradient(gleamX, gleamY, 2, cx, cy, 90);
      gleamGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      gleamGrad.addColorStop(0.3, "rgba(212, 175, 55, 0.05)");
      gleamGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gleamGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Volumetric light rays emanating from logo
      if (logoGlowSurge > 0.05) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const rayCount = 4;
        for (let r = 0; r < rayCount; r++) {
          const angle = (Date.now() * 0.0004 + (r * Math.PI) / 2) % (Math.PI * 2);
          const rayGrad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * 180, cy + Math.sin(angle) * 180);
          rayGrad.addColorStop(0, `rgba(255, 230, 130, ${logoGlowSurge * 0.08})`);
          rayGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, 180, angle - 0.1, angle + 0.1);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Slowly decay glow surge intensity
      logoGlowSurge *= 0.94;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [mounted]);

  // Parallax transform calculation for the layered 3D depth effect
  // Shifting the background slightly creates an immersive 3D perspective shift
  const bgTransform = mounted
    ? `translate3d(${smoothMouseRef.current.x * -18}px, ${smoothMouseRef.current.y * -18}px, 0) scale(1.05)`
    : "none";

  const canvasTransform = mounted
    ? `translate3d(${smoothMouseRef.current.x * -8}px, ${smoothMouseRef.current.y * -8}px, 0)`
    : "none";

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[500px] lg:max-w-[540px] mx-auto rounded-[24px] overflow-hidden border border-[#3a3a3a] bg-[#090909] shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)] cursor-default select-none group"
    >
      {/* 1. Underlying Premium agolden.png Image with Parallax */}
      <div 
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out pointer-events-none"
        style={{ 
          transform: bgTransform,
          willChange: "transform"
        }}
      >
        <Image
          src="/agolden.png"
          alt="AgncyPay 3D Core"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 540px"
          className="object-cover"
        />
      </div>

      {/* 2. Floating Gold Neon Lights & Particle Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen transition-transform duration-300 ease-out"
        style={{ 
          transform: canvasTransform,
          willChange: "transform"
        }}
      />

      {/* 3. Decorative UI Elements */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/20 pointer-events-none" />
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/20 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/20 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/20 pointer-events-none" />

      {/* Ambient shadow gradient ring overlay */}
      <div className="absolute inset-0 bg-radial-gradient opacity-20 pointer-events-none mix-blend-overlay" />
    </div>
  );
}
