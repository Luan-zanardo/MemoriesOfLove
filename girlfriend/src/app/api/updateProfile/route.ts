// /app/api/updateProfile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const {
    userId,
    name1,
    name2,
    startDate,
    storyTitle,
    timerTitle,
    playlistTitle,
    description,
    image1,
    image2,
    image3
  } = await req.json();

  if (!userId) return NextResponse.json({ error: "Usuário não fornecido" }, { status: 400 });

  // Verifica se o perfil existe
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("profiles")
      .update({
        name1,
        name2,
        start_date: startDate,
        story_title: storyTitle,
        timer_title: timerTitle,
        playlist_title: playlistTitle,
        description,
        image1,
        image2,
        image3
      })
      .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Perfil atualizado" });
  } else {
    const { error } = await supabase
      .from("profiles")
      .insert([{
        user_id: userId,
        name1,
        name2,
        start_date: startDate,
        story_title: storyTitle,
        timer_title: timerTitle,
        playlist_title: playlistTitle,
        description,
        image1,
        image2,
        image3
      }]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: "Perfil criado" });
  }
}