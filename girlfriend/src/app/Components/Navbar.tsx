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

  useEffect(() => {
    // Função para pegar sessão atual
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Puxa o nome da tabela users
        const { data: userData, error } = await supabase
          .from("users")
          .select("name")
          .eq("id", session.user.id)
          .single();

        if (error || !userData) {
          console.error("Erro ao buscar nome do usuário:", error);
          setUser({ id: session.user.id, name: "" });
        } else {
          setUser({ id: session.user.id, name: userData.name });
        }
      } else {
        setUser(null);
      }
    };

    fetchSession();

    // Ouvinte para mudanças de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: userData, error } = await supabase
          .from("users")
          .select("name")
          .eq("id", session.user.id)
          .single();

        if (error || !userData) {
          console.error("Erro ao buscar nome do usuário:", error);
          setUser({ id: session.user.id, name: "" });
        } else {
          setUser({ id: session.user.id, name: userData.name });
        }
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Não mostrar navbar nas telas de login e register
  if (pathname === "/" || pathname === "/register") return null;

  return (
    <nav className="flex justify-between md:justify-center items-center px-6 md:px-10 py-4 bg-linear-to-r from-pink-300 to-purple-300 shadow-md sticky top-0 z-50">
      {user ? (
        <ul className="flex justify-center gap-6 md:gap-10 text-white font-medium text-sm md:text-base">
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
        <ul className="flex justify-end w-full text-white font-medium text-sm md:text-base">
          <li className="hover:text-pink-100 cursor-pointer transition">
            <Link href="/">Login</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
