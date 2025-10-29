"use client";

import React from "react";

type PlaylistProps = {
  playlistUrl: string;
  setPlaylistUrl: (url: string) => void;
  isEditing: boolean;
};

export default function PlaylistSection({
  playlistUrl,
  setPlaylistUrl,
  isEditing,
}: PlaylistProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir somente links Spotify embed de track
    const regex =
      /^https:\/\/open\.spotify\.com\/embed\/track\/[a-zA-Z0-9]+(\?utm_source=generator)?$/;
    if (value === "" || regex.test(value)) {
      setPlaylistUrl(value);
    }
  };

  return (
    <section className="w-full bg-pink-100/60 rounded-3xl shadow-lg text-center p-8 md:p-12">
      <h3 className="text-xl md:text-2xl font-bold mb-4 text-pink-700">
        🎶 Nossa música preferida
      </h3>

      {/* Input de edição */}
      {isEditing && (
        <input
          type="text"
          value={playlistUrl}
          onChange={handleChange}
          placeholder="Cole o link Spotify embed da música"
          className="w-full max-w-md mb-6 p-2 border border-pink-300 rounded-lg text-gray-700 bg-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
      )}

      {/* Player do Spotify */}
      {playlistUrl ? (
        <div className="flex justify-center">
          <div className="w-full max-w-lg rounded-lg shadow-md">
            <iframe
              src={playlistUrl}
              className="w-full h-[152px]" // altura padrão do Spotify
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      ) : (
        !isEditing && <p className="text-gray-500">Nenhuma música selecionada.</p>
      )}
    </section>
  );
}