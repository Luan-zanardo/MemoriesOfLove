"use client";

import Link from "next/link";
import { useEdit } from "../context/EditContext";

export default function Navbar() {
  const { isEditing, setIsEditing } = useEdit();

  return (
    <nav className="flex flex-wrap items-center justify-between px-6 md:px-10 py-4 bg-white/20 backdrop-blur-md sticky top-0 z-50 shadow-md">
      <div className="text-lg md:text-xl font-bold text-white tracking-wide">
        💞 L&A Memories
      </div>

      <ul className="flex flex-wrap justify-center gap-4 md:gap-8 text-white font-medium text-sm md:text-base">
        <li className="hover:text-pink-100 cursor-pointer transition">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:text-pink-100 cursor-pointer transition">
          <Link href="/timeline">Timeline</Link>
        </li>
        <li className="hover:text-pink-100 cursor-pointer transition">
          <Link href="/gallery">Gallery</Link>
        </li>
        <li className="hover:text-pink-100 cursor-pointer transition">
          <Link href="/settings">Settings</Link>
        </li>
      </ul>

      <button
        onClick={() => setIsEditing(!isEditing)}
        className="bg-white text-pink-500 px-3 py-2 md:px-4 md:py-2 rounded-full font-semibold hover:bg-pink-50 transition text-sm md:text-base"
      >
        {isEditing ? "Salvar" : "Editar Página"}
      </button>
    </nav>
  );
}
