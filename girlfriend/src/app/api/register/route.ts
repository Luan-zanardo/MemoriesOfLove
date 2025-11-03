import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });

  // Verifica se usuário já existe
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });

  // Cria usuário
  const { data: user, error } = await supabase
    .from("users")
    .insert([{ email, password }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Usuário registrado com sucesso", user });
}
