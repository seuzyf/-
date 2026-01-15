import React, { useEffect, useRef } from 'react';
import { Particle } from '../types';

interface ParticleEffectProps {
  width: number;
  height: number;
  active: boolean;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ width, height, active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!active) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize
    particles.current = [];

    const spawnParticle = () => {
        // Spawn randomly around the card border area
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x = 0, y = 0;
        
        switch(side) {
            case 0: x = Math.random() * width; y = Math.random() * 5; break;
            case 1: x = width - Math.random() * 5; y = Math.random() * height; break;
            case 2: x = Math.random() * width; y = height - Math.random() * 5; break;
            case 3: x = Math.random() * 5; y = Math.random() * height; break;
        }

        particles.current.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 0.3, // Slower horizontal
            vy: (Math.random() - 0.5) * 0.3 - 0.2, // Slight upward drift
            life: 1.0,
            size: Math.random() * 1.5 + 0.5, // Smaller, more delicate size
            alpha: Math.random() * 0.8 + 0.2
        });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Spawn new particles continuously but gently
      if (particles.current.length < 150) {
        spawnParticle();
        spawnParticle();
      }

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;
        p.alpha = p.life * (Math.sin(Date.now() / 100) * 0.2 + 0.8); // Twinkle effect

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Golden Amber color with varying opacity
        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`; 
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [active, width, height]);

  return (
    <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="absolute top-0 left-0 pointer-events-none z-20"
    />
  );
};

export default ParticleEffect;