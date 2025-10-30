"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  // Impede o scroll do body enquanto esta tela estiver aberta
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleLogout = () => {
    // Exemplo: limpar dados locais
    // localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 bg-linear-to-br from-pink-300 to-purple-300 flex items-center justify-center">
      <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg p-8 mx-6 sm:mx-10 text-gray-800 text-center">
        <h1 className="text-3xl font-bold mb-6 text-pink-500">
          Configurações
        </h1>

        <p className="text-gray-700 mb-8">
          Aqui você pode sair da sua conta com segurança.<br />
          Obrigado por compartilhar momentos tão especiais 💖
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-white/60 hover:bg-white/80 text-red-500 font-semibold py-3 rounded-full transition shadow-md"
        >
          Sair da Conta
        </button>
      </div>
    </div>
  );
}
