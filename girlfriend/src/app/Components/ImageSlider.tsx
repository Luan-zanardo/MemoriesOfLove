"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageSlider({ isEditing, images, setImages }: any) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  const handleUpload = (e: any) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((f: any) => URL.createObjectURL(f));
    setImages([...images, ...urls]);
  };

  if (images.length === 0) return null;

  return (
    <section className="relative flex justify-center items-center py-12 bg-gradient-to-b from-purple-200 to-pink-100">
      <div className="w-[95%] sm:w-[85%] md:w-[70%] lg:w-[55%] aspect-[16/9] overflow-hidden rounded-2xl shadow-lg relative">
        <Image
          src={images[currentImage]}
          alt="Memória"
          fill
          className="object-cover transition-all duration-700 ease-in-out"
        />
      </div>

      <div className="absolute bottom-6 flex gap-3">
        {images.map((_: any, i: number) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === currentImage ? "bg-pink-500" : "bg-white/50"
            }`}
            onClick={() => setCurrentImage(i)}
          />
        ))}
      </div>

      {isEditing && (
        <div className="absolute top-4 right-4">
          <label className="cursor-pointer bg-white text-pink-600 px-3 py-2 rounded-md font-semibold hover:bg-pink-50 transition text-sm md:text-base">
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
