"use client";

import { useState, useEffect } from "react";
import HeroSection from "./Components/HeroSection";
import DescriptionSection from "./Components/DescriptionSection";
import ImageSlider from "./Components/ImageSlider";
import PlaylistSection from "./Components/PlaylistSection";

export default function HomePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Estados temporários para edição
  const [tempName1, setTempName1] = useState("Luan");
  const [tempName2, setTempName2] = useState("Anna");
  const [tempStartDate, setTempStartDate] = useState(new Date("2025-08-11"));
  const [tempTitle, setTempTitle] = useState("Nossa história de amor 💖");
  const [tempDescription, setTempDescription] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  );
  const [tempImages, setTempImages] = useState<string[]>(["/img1.jpg", "/img2.jpg"]);
  const [tempPlaylistUrl, setTempPlaylistUrl] = useState(
    "https://open.spotify.com/embed/track/6Pa6VpdGS8OfiVOEnNAHHw?utm_source=generator"
  );

  // Estados permanentes
  const [name1, setName1] = useState(tempName1);
  const [name2, setName2] = useState(tempName2);
  const [startDate, setStartDate] = useState(tempStartDate);
  const [title, setTitle] = useState(tempTitle);
  const [description, setDescription] = useState(tempDescription);
  const [images, setImages] = useState(tempImages);
  const [playlistUrl, setPlaylistUrl] = useState(tempPlaylistUrl);

  const [daysTogether, setDaysTogether] = useState(0);

  useEffect(() => {
    const diff = Math.floor(
      (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDaysTogether(diff);
  }, [startDate]);

  const handleSave = () => {
    setName1(tempName1);
    setName2(tempName2);
    setStartDate(tempStartDate);
    setTitle(tempTitle);
    setDescription(tempDescription);
    setImages(tempImages);
    setPlaylistUrl(tempPlaylistUrl);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName1(name1);
    setTempName2(name2);
    setTempStartDate(startDate);
    setTempTitle(title);
    setTempDescription(description);
    setTempImages(images);
    setTempPlaylistUrl(playlistUrl);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-pink-300 to-purple-300 text-gray-900 relative pb-24">
      {/* Botões de edição / salvar */}
      <div
        className={`flex gap-3 p-4 transition-all duration-300 ${
          isEditing
            ? "fixed bottom-4 right-4 z-50"
            : "absolute bottom-4 left-1/2 -translate-x-1/2"
        }`}
      >
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-semibold transition shadow-lg"
            >
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition shadow-lg"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-white text-pink-400 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-pink-50 transition"
          >
            Editar Página
          </button>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col gap-8 mx-auto max-w-5xl px-4 pt-8">
        <HeroSection
          isEditing={isEditing}
          name1={tempName1}
          setName1={setTempName1}
          name2={tempName2}
          setName2={setTempName2}
          startDate={tempStartDate}
          setStartDate={setTempStartDate}
          daysTogether={daysTogether}
        />

        <DescriptionSection
          isEditing={isEditing}
          title={tempTitle}
          setTitle={setTempTitle}
          description={tempDescription}
          setDescription={setTempDescription}
        />

        <ImageSlider
          isEditing={isEditing}
          images={tempImages}
          setImages={setTempImages}
        />

        <PlaylistSection
          playlistUrl={playlistUrl}
          setPlaylistUrl={isEditing ? setTempPlaylistUrl : setPlaylistUrl}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
