"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Cria usuário no Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      const userId = authData.user?.id;
      if (!userId) {
        setError("Erro ao criar usuário.");
        setLoading(false);
        return;
      }

      // 2️⃣ Cria registro na tabela users
      const { error: userError } = await supabase.from("users").insert([{ id: userId, name }]);
      if (userError) {
        setError("Erro ao criar usuário no banco de dados.");
        setLoading(false);
        return;
      }

      // 3️⃣ Cria registro na tabela user_home
      const { error: homeError } = await supabase.from("user_home").insert([{ user_id: userId }]);
      if (homeError) {
        setError("Conta criada, mas houve um erro ao criar a página inicial.");
        setLoading(false);
        return;
      }

      // 4️⃣ Redireciona para login
      router.push("/");
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro interno. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-pink-300 to-purple-300 text-gray-800 relative overflow-hidden">
      {/* Fundo animado */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-20 w-48 h-48 bg-pink-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Card de Registro */}
      <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[90%] max-w-md z-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">💖 Crie sua conta</h1>
        <p className="text-white/90 mb-6">Cadastre-se para começar sua história de amor</p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {/* Nome */}
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-full border-none focus:ring-2 focus:ring-pink-400 outline-none bg-white/70 placeholder-gray-500"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-full border-none focus:ring-2 focus:ring-pink-400 outline-none bg-white/70 placeholder-gray-500"
          />

          {/* Senha */}
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

          {/* Confirmar Senha */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 pr-12 rounded-full border-none focus:ring-2 focus:ring-pink-400 outline-none bg-white/70 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-75 hover:opacity-100 transition"
            >
              <Image
                src={showConfirmPassword ? "/visivel.png" : "/oculto.png"}
                alt={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                width={22}
                height={22}
              />
            </button>
          </div>

          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-400 hover:bg-pink-300 text-white font-semibold py-2 rounded-full transition-all shadow-md disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="text-sm text-white/90 mt-4">
          Já tem uma conta?{" "}
          <Link href="/" className="text-pink-100 underline hover:text-white transition">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
