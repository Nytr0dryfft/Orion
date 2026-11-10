import React, { useRef, useEffect, useState } from 'react';
import { getGreeting } from '../utils/orionCore';
import { audioSynth } from '../utils/audioSynth';

interface SculpturalCoreProps {
  isPlaying?: boolean;
}

const HOTLINKED_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1Wd_ra69V54grfm7uQnwqUwSJyn6t5cSCG0w_peswxlgTtj5tA0A5QcccY-dVaNNkSGHrETQhF0emaG5fvQsQ7EMIRxoZEwG8hz8m8Ty8Y31oitOnwrmi6eN6mXDtYI8LqrCIedc0cS1SGMb8hG1F4glwYOretLu-lCm5y0GWfe8AGPXOeU512kluiB4jBLpK9RaF1seyOYSzQ5oA2xii5myQ0V5e4iRqzXmPhSgw';

export const SculpturalCore: React.FC<SculpturalCoreProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [greeting, setGreeting] = useState(() => getGreeting(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreeting(new Date()));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Ambient procedural ribbon and orbital particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = 340;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; r: number; speed: number; angle: number; rad: number }[] = [];
    for (let i = 0; i < 48; i++) {
      particles.push({
        x: 0,
        y: 0,
        r: Math.random() * 1.5 + 0.5,
        speed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        angle: Math.random() * Math.PI * 2,
        rad: Math.random() * 140 + 40,
      });
    }

    const render = () => {
      t += 0.015;
      const energy = audioSynth.getEnergy();
      const dynamicScale = 1 + energy * 0.4;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw faint orbital rings
      for (let ring = 0; ring < 3; ring++) {
        const rx = (160 + ring * 55) * dynamicScale;
        const ry = (50 + ring * 18) * dynamicScale;
        const rot = t * 0.15 + (ring * Math.PI) / 3;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(242, 246, 250, ${0.04 + ring * 0.02 + energy * 0.05})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();

        ctx.restore();
      }

      // Draw mathematical wave filaments
      const wavesCount = 4;
      for (let w = 0; w < wavesCount; w++) {
        ctx.beginPath();
        const yOffset = (w - wavesCount / 2) * 12;
        const phase = t * 0.8 + w * 0.7;

        for (let x = -260; x <= 260; x += 6) {
          const normX = x / 260;
          const bellCurve = Math.exp(-normX * normX * 3.5);
          const y =
            Math.sin(x * 0.022 + phase) * 22 * bellCurve * (1 + (isPlaying ? 0.35 : 0)) +
            Math.cos(x * 0.045 - phase * 0.6) * 12 * bellCurve +
            yOffset;

          const screenX = cx + x;
          const screenY = cy + y;

          if (x === -260) {
            ctx.moveTo(screenX, screenY);
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }

        ctx.strokeStyle = `rgba(242, 246, 250, ${0.08 + (w / wavesCount) * 0.12 + (isPlaying ? 0.1 : 0)})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);
        ctx.stroke();
      }

      // Draw orbiting constellation dust
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.rad;
        const py = cy + Math.sin(p.angle) * (p.rad * 0.38);

        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 246, 250, ${0.25 + Math.sin(p.angle * 2) * 0.2})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isPlaying]);

  return (
    <main
      className="flex-1 flex flex-col items-center justify-center my-auto py-2 relative"
      data-purpose="intelligence-core"
    >
      {/* The Core Visual Asset */}
      <div className="w-full flex justify-center items-center relative">
        {/* Ambient soft caustic glow behind the image */}
        <div className="absolute w-[500px] h-[300px] bg-white/[0.025] blur-[100px] rounded-full pointer-events-none -z-10" />

        {/* Ambient Generative Procedural Sculpture Canvas */}
        <div className="relative w-full max-w-4xl flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-[340px] pointer-events-none select-none z-0"
            data-testid="sculpture-canvas"
          />

          {/* Hotlinked Image from HTML: with graceful handling so broken image never degrades UI */}
          {!imageError && (
            <img
              alt="ORION Artificial Intelligence Sculptural Core"
              className={`w-full max-w-4xl object-contain mx-auto mix-blend-screen drop-shadow-[0_0_50px_rgba(232,238,245,0.15)] pointer-events-none select-none transition-all duration-700 ease-out z-10 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              src={HOTLINKED_IMAGE_URL}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}

          {/* Fallback geometric core if image is still loading or unavailable */}
          {(!imageLoaded || imageError) && (
            <div className="w-48 h-48 sm:w-64 sm:h-64 my-6 rounded-full flex items-center justify-center relative pointer-events-none select-none z-10">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-white/10 blur-xl animate-pulse" />
              <div className="w-36 h-36 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#F2F6FA] to-[#687481] opacity-80 shadow-[0_0_24px_rgba(242,246,250,0.6)]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contextual Calm Greeting */}
      <div className="text-center mt-2 z-10 select-none">
        <h1 className="text-2xl sm:text-3xl font-light font-sora text-[#F2F6FA] tracking-wide mb-1.5">
          {greeting.heading}
        </h1>
        <p className="text-xs sm:text-sm font-normal text-[#8795A6] tracking-wider font-sans">
          {greeting.subheading}
        </p>
      </div>
    </main>
  );
};
