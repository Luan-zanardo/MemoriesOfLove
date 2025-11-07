"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type HeroSectionProps = {
  isEditing: boolean;
  name1: string;
  setName1: (v: string) => void;
  name2: string;
  setName2: (v: string) => void;
  startDate: Date;
  setStartDate: (v: Date) => void;
  daysTogether: number;
  isPlaying: boolean;
  togglePlay: () => void;
};

export default function HeroSection({
  isEditing,
  name1,
  setName1,
  name2,
  setName2,
  startDate,
  setStartDate,
  daysTogether,
  isPlaying,
  togglePlay,
}: HeroSectionProps) {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 👇 Esconde/mostra o texto “role para ver mais” conforme o scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollY && currentScroll > 50) {
        setShowScrollHint(false);
      } else if (currentScroll < lastScrollY) {
        setShowScrollHint(true);
      }
      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <section className="flex flex-col items-center justify-center text-center relative min-h-[90vh] px-4">
      <div className="flex flex-col items-center justify-center gap-3">
        {isEditing ? (
          <>
            <input
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="Seu nome"
              className="text-3xl sm:text-4xl text-white font-bold bg-transparent border-b border-white/70 text-center outline-none"
            />
            <span className="text-white text-3xl">&</span>
            <input
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Nome dela"
              className="text-3xl sm:text-4xl text-white font-bold bg-transparent border-b border-white/70 text-center outline-none"
            />
            <input
              type="date"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="text-sm text-pink-100 mt-2 bg-transparent border-b border-white/50 text-center outline-none"
            />
          </>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-md">
              {name1} & {name2}
            </h1>
            <p className="text-white text-lg mt-2">
              ⭐ Juntos há {daysTogether} dias ⭐
            </p>
          </>
        )}
      </div>

      {/* 🎵 Botão de Play centralizado */}
      <motion.button
        onClick={togglePlay}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-24 bg-white/20 text-white backdrop-blur-md border border-white/30 rounded-full px-5 py-2 text-sm sm:text-base font-semibold hover:bg-white/30 transition"
      >
        {isPlaying ? "⏸ Pausar música" : "Tocar música"}
      </motion.button>

      {/* 👇 Animação do texto 'Role para ver mais' */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            key="scrollHint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-12 text-white text-sm opacity-90"
          >
            <p> ↓ Role para ver mais ↓ </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
