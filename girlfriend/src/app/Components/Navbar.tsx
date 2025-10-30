"use client";

import Link from "next/link";
import { useEdit } from "../context/EditContext";

export default function Navbar() {
  const { isEditing, setIsEditing } = useEdit();

  return (
    <nav className="flex justify-center items-center px-6 md:px-10 py-4 bg-linear-to-r from-pink-300 to-purple-300 shadow-md sticky top-0 z-50">
      <ul className="flex justify-center gap-6 md:gap-10 text-white font-medium text-sm md:text-base">
        <li className="hover:text-pink-100 cursor-pointer transition">
          <Link href="/">Home</Link>
        </li>
        <li className="hover:text-pink-100 cursor-pointer transition">
          <Link href="/timeline">Timeline</Link>
        </li>
        <li className="hover:text-pink-100 cursor-pointer transition">
          <Link href="/settings">Settings</Link>
        </li>
      </ul>
    </nav>
  );
}
