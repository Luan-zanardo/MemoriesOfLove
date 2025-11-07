"use client";

import React, { RefObject, useState } from "react";
import { Play, Pause } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

type PlaylistProps = {
  title: string;
  setTitle: (title: string) => void;
  isEditing: boolean;
  audioUrl?: string;
  setAudioUrl?: (url: string) => void;

  // ✅ Novas props para sincronizar com o HeroSection
  isPlaying: boolean;
  togglePlay: () => void;
  audioRef: RefObject<HTMLAudioElement | null>;
};

// 🔹 Inicializa o Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PlaylistSection({
  title,
  setTitle,
  isEditing,
  audioUrl,
  setAudioUrl,
  isPlaying,
  togglePlay,
  audioRef,
}: PlaylistProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 🔹 Formata o tempo em mm:ss
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    setCurrentTime(currentTime);
    setDuration(duration);
    setProgress((currentTime / (duration || 1)) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime =
        (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  // 🔼 Upload de MP3 para o Supabase Storage
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const timestamp = Date.now();

      // 🔹 Limpa nome do arquivo (sem espaços, acentos, etc)
      const sanitizedFileName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .replace(/\s+/g, "_") // troca espaços por _
        .replace(/[^a-zA-Z0-9._-]/g, ""); // remove símbolos inválidos

      const filePath = `${timestamp}_${sanitizedFileName}`;

      const { data, error } = await supabase.storage
        .from("audios")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Erro no upload:", error.message);
        alert("Erro ao enviar o áudio: " + error.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("audios")
        .getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl;
      if (!publicUrl) throw new Error("Não foi possível obter a URL pública.");

      if (typeof setAudioUrl === "function") {
        setAudioUrl(publicUrl);
      }
    } catch (err) {
      console.error("Erro no upload:", err);
      alert("Erro ao enviar o áudio.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="w-full bg-pink-100/60 rounded-3xl shadow-lg text-center p-6 md:p-10 flex flex-col items-center transition-all duration-300">
      {/* 🔹 Título editável */}
      {isEditing ? (
        <input
          className="text-xl md:text-2xl font-bold mb-5 w-full text-center border-b-2 border-pink-300 bg-transparent outline-none focus:border-pink-500 transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título..."
        />
      ) : (
        <h3 className="text-xl md:text-2xl font-semibold mb-5 text-pink-700">
          {title}
        </h3>
      )}

      {/* 🔹 Upload */}
      {isEditing && (
        <div className="mb-4 w-full flex justify-center flex-col items-center">
          <label className="text-sm text-gray-600 mb-2">
            Envie sua música (MP3)
          </label>
          <input
            type="file"
            accept="audio/mp3,audio/mpeg,audio/wav"
            onChange={handleFileChange}
            className="block w-full max-w-sm text-sm text-gray-700 border border-pink-300 rounded-lg cursor-pointer p-3 bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          {isUploading && (
            <p className="text-pink-500 text-sm mt-2">🎧 Enviando música...</p>
          )}
        </div>
      )}

      {/* 🔹 Player */}
      {audioUrl ? (
        <div className="flex flex-col items-center w-full max-w-[calc(100%-2rem)] bg-pink-100 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-lg transition">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setProgress(0)}
          />

          <div className="relative w-24 h-24 md:w-28 md:h-28 mb-5">
            <div className="w-full h-full bg-linear-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center shadow-inner shadow-pink-400/40">
              <button
                onClick={togglePlay}
                className="bg-white/80 hover:bg-white text-pink-500 rounded-full p-4 shadow-md transition"
              >
                {isPlaying ? <Pause size={26} /> : <Play size={26} />}
              </button>
            </div>
          </div>

          <div className="relative w-full mb-3">
            <input
              type="range"
              value={progress}
              onChange={handleSeek}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-pink-200 accent-pink-500 
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-pink-400
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:hover:scale-110"
            />
          </div>

          <div className="text-sm text-pink-500">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      ) : (
        !isEditing && (
          <p className="text-gray-500 text-sm">
            Nenhuma faixa de áudio adicionada.
          </p>
        )
      )}
    </section>
  );
}
