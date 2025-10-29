"use client";

import { useState, useEffect } from "react";
import HeroSection from "./Components/HeroSection";
import DescriptionSection from "./Components/DescriptionSection";
import ImageSlider from "./Components/ImageSlider";
import PlaylistSection from "./Components/PlaylistSection";
import { useEdit } from "./context/EditContext";

export default function HomePage() {
  const { isEditing } = useEdit(); // ✅ usa o estado global
  const [name1, setName1] = useState("Luan");
  const [name2, setName2] = useState("Anna");
  const [startDate, setStartDate] = useState(new Date("2025-08-11"));
  const [title, setTitle] = useState("Nossa história de amor 💖");
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  );
  const [images, setImages] = useState<string[]>(["/img1.jpg", "/img2.jpg"]);

  const [daysTogether, setDaysTogether] = useState(0);

  useEffect(() => {
    const diff = Math.floor(
      (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDaysTogether(diff);
  }, [startDate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-300 to-purple-300 text-gray-900">
      <HeroSection
        isEditing={isEditing}
        name1={name1}
        setName1={setName1}
        name2={name2}
        setName2={setName2}
        startDate={startDate}
        setStartDate={setStartDate}
        daysTogether={daysTogether}
      />
      <DescriptionSection
        isEditing={isEditing}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />
      <ImageSlider
        isEditing={isEditing}
        images={images}
        setImages={setImages}
      />
      <PlaylistSection />
    </div>
  );
}