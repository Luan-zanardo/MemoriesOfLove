import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    // Busca usuário pelo e-mail
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    // Compara senhas (sem criptografia)
    if (user.password !== password) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error("Erro no login:", err);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
