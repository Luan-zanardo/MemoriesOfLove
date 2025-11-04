import { supabase } from "@/lib/supabaseClient";

// ✅ GET: Busca os dados da home do usuário
export async function GET(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    console.log("🔍 Buscando usuário:", username);

    // Buscar usuário pelo nome (case-insensitive)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, name")
      .ilike("name", username)
      .single();

    if (userError || !user) {
      console.error("⚠️ Usuário não encontrado:", userError);
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        { status: 404 }
      );
    }

    console.log("✅ Usuário encontrado:", user);

    // Buscar home vinculada ao usuário
    const { data: home, error: homeError } = await supabase
      .from("user_home")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (homeError || !home) {
      console.warn("ℹ️ Nenhuma home encontrada para este usuário.");
      return new Response(
        JSON.stringify({ error: "Home não encontrada" }),
        { status: 404 }
      );
    }

    console.log("🏠 Home carregada com sucesso:", home.id);
    return new Response(JSON.stringify({ home }), { status: 200 });
  } catch (err) {
    console.error("❌ Erro inesperado:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500 }
    );
  }
}

// ✅ POST: Cria ou atualiza a home do usuário (sem usar onConflict)
export async function POST(
  req: Request,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await context.params;
    console.log("📝 Salvando dados para:", username);

    const body = await req.json();

    // Buscar o ID do usuário
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .ilike("name", username)
      .single();

    if (userError || !user) {
      console.error("⚠️ Usuário não encontrado:", userError);
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado" }),
        { status: 404 }
      );
    }

    // Verifica se já existe home para o usuário
    const { data: existingHome, error: existingError } = await supabase
      .from("user_home")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingError) throw existingError;

    let error = null;

    if (existingHome) {
      // Atualiza se já existir
      console.log("🔄 Atualizando home existente...");
      ({ error } = await supabase
        .from("user_home")
        .update(body)
        .eq("user_id", user.id));
    } else {
      // Cria se não existir
      console.log("✨ Criando nova home...");
      ({ error } = await supabase
        .from("user_home")
        .insert({ user_id: user.id, ...body }));
    }

    if (error) throw error;

    console.log("✅ Dados salvos com sucesso para:", username);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error("❌ Erro no POST:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
