"use client";

import { useEffect, useState } from "react";

type RelationshipTimerProps = {
  startDate: Date;
  setStartDate: (date: Date) => void;
  isEditing: boolean;
  title: string;
  setTitle: (title: string) => void;
};

export default function RelationshipTimer({
  startDate,
  setStartDate,
  isEditing,
  title,
  setTitle,
}: RelationshipTimerProps) {
  const [time, setTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      let diff = now.getTime() - startDate.getTime();

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      diff -= years * 1000 * 60 * 60 * 24 * 365;

      const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
      diff -= months * 1000 * 60 * 60 * 24 * 30;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * 1000 * 60 * 60 * 24;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * 1000 * 60 * 60;

      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * 1000 * 60;

      const seconds = Math.floor(diff / 1000);

      setTime({ years, months, days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <section className="w-full bg-pink-100/60 rounded-3xl shadow-lg p-8 md:p-12 text-gray-800 text-center">
      {isEditing ? (
        <input
          className="text-2xl md:text-3xl font-bold mb-6 w-full text-center border-b-2 border-pink-300 bg-transparent outline-none focus:border-pink-500 transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-pink-700">{title}</h2>
      )}

      {isEditing && (
        <div className="mb-6">
          <label className="text-sm md:text-base font-medium text-gray-700 mb-2 block">
            Data que nos conhecemos:
          </label>
          <input
            type="date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="text-center bg-white/50 border border-pink-200 rounded-full px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 justify-center max-w-md mx-auto">
        {[
          { label: "Anos", value: time.years },
          { label: "Meses", value: time.months },
          { label: "Dias", value: time.days },
          { label: "Horas", value: time.hours },
          { label: "Minutos", value: time.minutes },
          { label: "Segundos", value: time.seconds },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-pink-100 rounded-full px-3 py-2 text-center text-base md:text-lg font-semibold flex flex-col items-center"
          >
            <div className="text-xs md:text-sm text-gray-500 mb-1">{item.label}</div>
            {item.value}
          </div>
        ))}
      </div>
    </section>
  );
}
