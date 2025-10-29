"use client";

import Image from "next/image";
import { useState } from "react";

type ImageSliderProps = {
  isEditing: boolean;
  images: string[];
  setImages: (images: string[]) => void;
};

export default function ImageSlider({
  isEditing,
  images,
  setImages,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...urls]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (currentIndex >= newImages.length) setCurrentIndex(0);
  };

  // Garante pelo menos 3 imagens visíveis usando a imagem branca como fallback
  const paddedImages =
    images.length >= 3
      ? images
      : [...images, ...Array(3 - images.length).fill("/imgwhite.png")];

  const visibleImages = [
    paddedImages[(currentIndex - 1 + paddedImages.length) % paddedImages.length],
    paddedImages[currentIndex % paddedImages.length],
    paddedImages[(currentIndex + 1) % paddedImages.length],
  ];

  const showNavButtons = images.length >= 3;

  return (
    <section className="relative py-12 w-full flex flex-col items-center bg-pink-100/60 rounded-2xl shadow-lg overflow-hidden">
      <div className="relative w-full max-w-5xl flex items-center justify-center gap-4 px-6 md:px-12">
        {/* Botão esquerdo */}
        {showNavButtons && (
          <button
            onClick={prevImage}
            className="bg-white/80 text-pink-600 rounded-full p-3 hover:bg-white shadow-md z-10 flex items-center justify-center"
          >
            ‹
          </button>
        )}

        {/* Imagens visíveis */}
        <div className="flex gap-4 flex-1 justify-center min-w-0">
          {visibleImages.map((img, idx) => {
            const globalIndex =
              (currentIndex - 1 + idx + paddedImages.length) % paddedImages.length;
            return (
              <div
                key={idx}
                className="relative flex-1 aspect-square rounded-2xl shadow-lg overflow-hidden border-7 border-pink-300"
              >
                <Image
                  src={img}
                  alt={`Memória ${idx}`}
                  fill
                  className="object-cover shadow-md"
                />
                {isEditing && globalIndex < images.length && (
                  <button
                    onClick={() => removeImage(globalIndex)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Botão direito */}
        {showNavButtons && (
          <button
            onClick={nextImage}
            className="bg-white/80 text-pink-600 rounded-full p-3 hover:bg-white shadow-md z-10 flex items-center justify-center"
          >
            ›
          </button>
        )}
      </div>

      {/* Upload no modo edição */}
      {isEditing && (
        <div className="mt-6">
          <label className="cursor-pointer bg-white text-pink-600 px-4 py-2 rounded-md font-semibold hover:bg-pink-50 transition text-sm md:text-base">
            + Adicionar Fotos
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </section>
  );
}