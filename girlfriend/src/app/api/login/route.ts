import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !user) return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });

  return NextResponse.json({ message: "Login realizado", user });
}