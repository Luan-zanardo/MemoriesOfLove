"use client";

import { useState, useEffect } from "react";
import HeroSection from "./Components/HeroSection";
import DescriptionSection from "./Components/DescriptionSection";
import ImageSlider from "./Components/ImageSlider";
import PlaylistSection from "./Components/PlaylistSection";
import FallingHearts from "./Components/FallingHearts";
import RelationshipTimer from "./Components/RelationshipTimer";

export default function HomePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Estados temporários para edição
  const [tempName1, setTempName1] = useState("Seu Nome");
  const [tempName2, setTempName2] = useState("Nome Dela");
  const [tempStartDate, setTempStartDate] = useState(new Date("2025-08-10"));

  // Títulos separados para cada componente
  const [tempStoryTitle, setTempStoryTitle] = useState("💖 Nossa história de amor");
  const [tempTimerTitle, setTempTimerTitle] = useState("💞 Feliz ao seu lado há");
  const [tempPlaylistTitle, setTempPlaylistTitle] = useState("🎶 Nossa música preferida");

  const [tempDescription, setTempDescription] = useState(
    "Cada momento ao seu lado é único e especial. Você transforma meus dias com seu sorriso, aquece meu coração com seu carinho e me inspira a ser uma pessoa melhor. Juntos, construímos memórias que guardarei para sempre, e cada instante com você é um capítulo inesquecível da nossa linda história. Te amo mais do que palavras podem expressar."
  );
  const [tempImages, setTempImages] = useState<string[]>(["/noimage.png", "/noimage.png", "/noimage.png"]);
  const [tempPlaylistUrl, setTempPlaylistUrl] = useState(
    "https://open.spotify.com/embed/track/6Pa6VpdGS8OfiVOEnNAHHw?utm_source=generator"
  );

  // Estados permanentes
  const [name1, setName1] = useState(tempName1);
  const [name2, setName2] = useState(tempName2);
  const [startDate, setStartDate] = useState(tempStartDate);

  const [storyTitle, setStoryTitle] = useState(tempStoryTitle);
  const [timerTitle, setTimerTitle] = useState(tempTimerTitle);
  const [playlistTitle, setPlaylistTitle] = useState(tempPlaylistTitle);

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

    setStoryTitle(tempStoryTitle);
    setTimerTitle(tempTimerTitle);
    setPlaylistTitle(tempPlaylistTitle);

    setDescription(tempDescription);
    setImages(tempImages);
    setPlaylistUrl(tempPlaylistUrl);

    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName1(name1);
    setTempName2(name2);
    setTempStartDate(startDate);

    setTempStoryTitle(storyTitle);
    setTempTimerTitle(timerTitle);
    setTempPlaylistTitle(playlistTitle);

    setTempDescription(description);
    setTempImages(images);
    setTempPlaylistUrl(playlistUrl);

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-pink-300 to-purple-300 text-gray-900 relative pb-24 overflow-hidden">
      <FallingHearts />

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
              className="bg-pink-100/60 hover:bg-pink-50 text-pink-400 px-5 py-2 rounded-full font-semibold transition shadow-lg"
            >
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="bg-pink-100/60 hover:bg-pink-50 text-pink-400 px-5 py-2 rounded-full font-semibold transition shadow-lg"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-pink-100/60 text-pink-400 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-pink-50 transition"
          >
            Editar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-8 mx-auto max-w-5xl px-4 pt-8 relative z-10">
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

        <RelationshipTimer
          startDate={tempStartDate}
          setStartDate={setTempStartDate}
          isEditing={isEditing}
          title={tempTimerTitle}
          setTitle={setTempTimerTitle}
        />

        <DescriptionSection
          isEditing={isEditing}
          title={tempStoryTitle}
          setTitle={setTempStoryTitle}
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
          title={tempPlaylistTitle}
          setTitle={setTempPlaylistTitle}
        />
      </div>
    </div>
  );
}
