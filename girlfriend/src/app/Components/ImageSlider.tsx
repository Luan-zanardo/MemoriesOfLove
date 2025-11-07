"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const timestamp = Date.now();
      const sanitizedFileName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");

      const filePath = `${timestamp}_${sanitizedFileName}`;
      const { error } = await supabase.storage
        .from("user-images")
        .upload(filePath, file);

      if (error) {
        console.error("Erro no upload:", error.message);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("user-images")
        .getPublicUrl(filePath);

      const publicUrl = publicData?.publicUrl;
      if (!publicUrl) throw new Error("Não foi possível obter a URL pública.");

      setImages([...images, publicUrl]);
    } catch (err) {
      console.error("Erro ao enviar a imagem:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Calcula imagens visíveis (respeitando o total de imagens)
  let visibleImagesDesktop: string[] = [];
  if (images.length <= 3) {
    visibleImagesDesktop = images;
  } else {
    visibleImagesDesktop = [
      images[currentIndex],
      images[(currentIndex + 1) % images.length],
      images[(currentIndex + 2) % images.length],
    ];
  }

  const showDesktopArrows = images.length > 3;
  const showMobileArrows = images.length > 1;

  return (
    <section className="py-5 w-full flex flex-col items-center bg-pink-100/60 rounded-2xl shadow-lg overflow-hidden relative">
      {images.length === 0 && !isUploading && (
        <p className="text-gray-500 text-sm text-center py-6">
          Nenhuma imagem adicionada.
        </p>
      )}

      {isEditing && (
        <label className="mb-4 bg-pink-400 hover:bg-pink-300 text-white px-4 py-2 rounded-lg cursor-pointer shadow-md transition">
          Adicionar nova imagem
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      )}

      {isUploading && (
        <p className="text-pink-500 text-sm mt-2 text-center">
          Enviando imagem...
        </p>
      )}

      {/* MOBILE */}
      <div className="relative w-full px-4 sm:max-w-sm md:hidden flex items-center justify-center">
        {images.length > 0 && images[currentIndex] && (
          <div className="w-full aspect-square relative rounded-2xl overflow-hidden">
            <Image
              src={images[currentIndex]}
              alt={`Imagem ${currentIndex + 1}`}
              fill
              className="object-cover"
            />
            {isEditing && (
              <button
                onClick={() => handleRemove(currentIndex)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        )}

        {showMobileArrows && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
            >
              <Image src="/leftFlex.png" alt="Anterior" width={30} height={30} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Image src="/rightFlex.png" alt="Próxima" width={30} height={30} />
            </button>
          </>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex items-center w-full max-w-5xl px-4 justify-center relative">
        {showDesktopArrows && (
          <button
            onClick={prevImage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2"
          >
            <Image src="/leftFlex.png" alt="Anterior" width={40} height={40} />
          </button>
        )}

        <div className="flex gap-4 justify-center w-full transition-transform duration-300 ease-in-out">
          {visibleImagesDesktop.map((img, idx) => (
            <div
              key={idx}
              className="relative flex-1 max-w-[30%] rounded-2xl overflow-hidden border-2 border-pink-300/50 shadow-md bg-white"
            >
              <div className="w-full aspect-square relative">
                <Image
                  src={img}
                  alt={`Imagem ${currentIndex + idx + 1}`}
                  fill
                  className="object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() =>
                      handleRemove((currentIndex + idx) % images.length)
                    }
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showDesktopArrows && (
          <button
            onClick={nextImage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
          >
            <Image src="/rightFlex.png" alt="Próxima" width={40} height={40} />
          </button>
        )}
      </div>
    </section>
  );
}
