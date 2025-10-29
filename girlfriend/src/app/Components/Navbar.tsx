"use client"; // ✅ Adicione isso na primeira linha do arquivo

import Link from "next/link";
import { useEdit } from "../context/EditContext";

export default function Navbar() {
  const { isEditing, setIsEditing } = useEdit();

  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-4
                    bg-linear-to-r from-pink-300 to-purple-300 shadow-md sticky top-0 z-50">
      <div className="text-lg md:text-xl font-bold text-white tracking-wide flex-1 text-center md:text-left">
        💞 L&A Memories
      </div>

      <ul className="flex-1 flex justify-center gap-4 md:gap-8 text-white font-medium text-sm md:text-base">
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

      <div className="flex-1"></div>
    </nav>
  );
}