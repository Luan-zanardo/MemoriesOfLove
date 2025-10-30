"use client";

import { useEffect, useState } from "react";

type Heart = {
  id: number;
  left: number;
  duration: number;
  size: number;
};

export default function FallingHearts() {
  const [mounted, setMounted] = useState(false); // garante renderização apenas no cliente
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    setMounted(true); // agora estamos no cliente
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      const newHeart: Heart = {
        id: Date.now(),
        left: Math.random() * 100, // posição horizontal (%)
        duration: 4000 + Math.random() * 2000, // duração da animação
        size: 24 + Math.random() * 24, // tamanho do coração
      };
      setHearts((prev) => [...prev, newHeart]);

      // remove coração após a animação
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, newHeart.duration);
    }, 300);

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) return null; // evita render no SSR

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <img
          key={heart.id}
          src="/coracao.png"
          alt="Coração"
          className="absolute"
          style={{
            left: `${heart.left}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animation: `fall ${heart.duration}ms linear`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
