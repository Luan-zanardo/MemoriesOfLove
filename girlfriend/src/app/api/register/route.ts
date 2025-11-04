import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    // Verifica se já existe usuário com o mesmo e-mail ou nome
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .or(`email.eq.${email},name.eq.${name}`)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "E-mail ou nome já cadastrado." }, { status: 400 });
    }

    // Cria usuário (senha em texto simples, pode adicionar hash depois)
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert([{ name, email, password }])
      .select()
      .single();

    if (userError || !newUser) {
      console.error("Erro ao criar usuário:", userError);
      return NextResponse.json({ error: "Erro ao criar usuário." }, { status: 500 });
    }

    // 🔹 Cria automaticamente a home do usuário
    const { error: homeError } = await supabase
      .from("user_home")
      .insert([{ user_id: newUser.id }]);

    if (homeError) {
      console.error("Erro ao criar home padrão:", homeError);
      return NextResponse.json({
        error: "Usuário criado, mas erro ao criar página home.",
      }, { status: 500 });
    }

    // Remove senha antes de retornar
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error("Erro no registro:", err);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
