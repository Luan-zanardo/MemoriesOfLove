"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface User {
  id: string;
  name: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async (userId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("name")
        .eq("id", userId)
        .single();

      if (error || !userData) {
        console.error("Erro ao buscar nome do usuário:", error);
        setUser({ id: userId, name: "" });
      } else {
        setUser({ id: userId, name: userData.name });
      }
    } catch (err) {
      console.error("Erro inesperado ao buscar usuário:", err);
      setUser({ id: userId, name: "" });
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erro ao buscar sessão:", error);
        return;
      }
      if (session?.user) fetchUser(session.user.id);
      else setUser(null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchUser(session.user.id);
      else setUser(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Não mostrar navbar nas telas de login e register
  if (pathname === "/" || pathname === "/register") return null;

  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-4 bg-linear-to-r from-pink-300 to-purple-300 shadow-md sticky top-0 z-50">
      {user ? (
        <ul className="flex w-full max-w-md justify-center gap-6 md:gap-10 text-white font-medium text-sm md:text-base mx-auto">
          <li className="hover:text-pink-100 cursor-pointer transition">
            <Link href={`/home/${user.name}`}>Home</Link>
          </li>
          <li className="hover:text-pink-100 cursor-pointer transition">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
                window.location.href = "/";
              }}
            >
              Sair da conta
            </button>
          </li>
        </ul>
      ) : (
        <div className="flex w-full justify-end">
          <ul className="flex text-white font-medium text-sm md:text-base">
            <li className="hover:text-pink-100 cursor-pointer transition">
              <Link href="/">Login</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
