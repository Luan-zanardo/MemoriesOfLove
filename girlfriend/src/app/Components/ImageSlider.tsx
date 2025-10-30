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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages[index] = "";
    setImages(newImages);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const filledImages = [...images];
  while (filledImages.length < 3) filledImages.push("");

  return (
    <section className="py-5 w-full flex justify-center bg-pink-100/60 rounded-2xl shadow-lg overflow-hidden">
      {/* Mobile */}
      {isEditing ? (
        <div className="flex gap-2 w-full px-4 justify-center flex-wrap md:hidden">
          {filledImages.map((img, idx) => (
            <div
              key={idx}
              className="relative flex-none w-28 aspect-square rounded-2xl overflow-hidden border-2 border-pink-300/50 shadow-md bg-white"
            >
              {img ? (
                <>
                  <Image
                    src={img}
                    alt={`Imagem ${idx + 1}`}
                    fill
                    className="object-cover transition-opacity duration-500 ease-in-out"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <label className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-white/90 cursor-pointer">
                      <Image src="/edit.png" alt="Editar" width={14} height={14} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUpload(e, idx)}
                      />
                    </label>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-pink-100 cursor-pointer hover:bg-pink-200 transition rounded-xl">
                  <Image src="/edit.png" alt="Adicionar" width={28} height={28} className="mb-2" />
                  <span className="text-pink-700 text-sm font-semibold">
                    Adicionar imagem
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, idx)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Mobile visualização: apenas uma imagem com transição suave
        <div className="relative w-full px-4 sm:max-w-sm md:hidden flex items-center justify-center">
          <div className="w-full aspect-square relative rounded-2xl overflow-hidden">
            {filledImages.map((img, idx) => (
              <Image
                key={idx}
                src={img || "/placeholder.png"} // opcional placeholder
                alt={`Imagem ${idx + 1}`}
                fill
                className={`object-cover transition-opacity duration-500 ease-in-out absolute top-0 left-0 w-full h-full ${
                  idx === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
          >
            ◀
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
          >
            ▶
          </button>
        </div>
      )}

      {/* Desktop: todas as imagens lado a lado com transição */}
      <div className="hidden md:flex gap-4 w-full max-w-5xl px-4 justify-center">
        {filledImages.map((img, idx) => (
          <div
            key={idx}
            className="relative flex-1 rounded-2xl overflow-hidden border-2 border-pink-300/50 shadow-md bg-white"
          >
            <div className="w-full aspect-square relative">
              {img ? (
                <>
                  <Image
                    src={img}
                    alt={`Imagem ${idx + 1}`}
                    fill
                    className="object-cover transition-opacity duration-500 ease-in-out"
                  />
                  {isEditing && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <label className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-white/90 cursor-pointer">
                        <Image src="/edit.png" alt="Editar" width={16} height={16} />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUpload(e, idx)}
                        />
                      </label>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </>
              ) : (
                isEditing && (
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-pink-100 cursor-pointer hover:bg-pink-200 transition rounded-xl">
                    <Image src="/edit.png" alt="Adicionar" width={28} height={28} className="mb-2" />
                    <span className="text-pink-700 text-sm font-semibold">
                      Adicionar imagem
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(e, idx)}
                    />
                  </label>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}