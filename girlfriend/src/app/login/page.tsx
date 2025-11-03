"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.error) {
      setError(data.error);
      return;
    }

    // Salva info do usuário na sessão (para uso no home)
    sessionStorage.setItem("user", JSON.stringify(data.user));
    router.push("/"); // Redireciona para home
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-pink-300 to-purple-300 text-gray-800 relative overflow-hidden">
      {/* Fundo animado */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-20 w-48 h-48 bg-pink-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] max-w-md z-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">💖 Bem-vindo de volta</h1>
        <p className="text-white/90 mb-6">Faça login para acessar sua história de amor</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-full border-none focus:ring-2 focus:ring-pink-400 outline-none bg-white/70 placeholder-gray-500" />

          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 pr-12 rounded-full border-none focus:ring-2 focus:ring-pink-400 outline-none bg-white/70 placeholder-gray-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-75 hover:opacity-100 transition">
              <Image src={showPassword ? "/visivel.png" : "/oculto.png"} alt={showPassword ? "Ocultar senha" : "Mostrar senha"} width={22} height={22} />
            </button>
          </div>

          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

          <button type="submit" className="bg-pink-400 hover:bg-pink-300 text-white font-semibold py-2 rounded-full transition-all shadow-md">Entrar</button>
        </form>

        <p className="text-sm text-white/90 mt-4">
          Ainda não tem uma conta?{" "}
          <Link href="/register" className="text-pink-100 underline hover:text-white transition">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}