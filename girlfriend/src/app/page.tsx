"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // 1️⃣ Loga via Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        setError("Erro ao logar. Tente novamente.");
        return;
      }

      // 2️⃣ Busca o name do usuário na tabela users
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("name")
        .eq("id", userId)
        .single();

      if (userError || !user) {
        setError("Usuário não encontrado.");
        return;
      }

      // 3️⃣ Salva sessionStorage (opcional) e redireciona
      sessionStorage.setItem("user", JSON.stringify(user));
      router.push(`/home/${user.name}`);
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro interno. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-pink-300 to-purple-300 text-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-20 w-48 h-48 bg-pink-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] max-w-md z-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">💖 Bem-vindo de volta</h1>
        <p className="text-white/90 mb-6">Faça login para acessar sua história de amor</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-full border-none focus:ring-2 focus:ring-pink-400 outline-none bg-white/70 placeholder-gray-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-12 rounded-full border-none focus:ring-2 focus:ring-pink-400 outline-none bg-white/70 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-75 hover:opacity-100 transition"
            >
              <Image
                src={showPassword ? "/visivel.png" : "/oculto.png"}
                alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
                width={22}
                height={22}
              />
            </button>
          </div>

          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

          <button
            type="submit"
            className="bg-pink-400 hover:bg-pink-300 text-white font-semibold py-2 rounded-full transition-all shadow-md"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-white/90 mt-4">
          Ainda não tem uma conta?{" "}
          <Link href="/register" className="text-pink-100 underline hover:text-white transition">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
