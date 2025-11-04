"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import HeroSection from "../../Components/HeroSection";
import DescriptionSection from "../../Components/DescriptionSection";
import ImageSlider from "../../Components/ImageSlider";
import PlaylistSection from "../../Components/PlaylistSection";
import FallingHearts from "../../Components/FallingHearts";
import RelationshipTimer from "../../Components/RelationshipTimer";

export default function UserHomePage() {
  const params = useParams();
  const username = params.username as string;

  const [userHome, setUserHome] = useState<any>(null);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Busca sessão do Supabase
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionUser(session?.user ?? null);
    };
    getSession();
  }, []);

  const isOwner = sessionUser?.id && userHome?.user_id === sessionUser.id;

  // 🧩 Carrega dados do usuário
  useEffect(() => {
    const fetchHome = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/home/${username}`);
        const data = await res.json();
        if (res.ok) setUserHome(data.home);
        else setUserHome(null);
      } catch (err) {
        console.error("Erro ao buscar home:", err);
      }
      setLoading(false);
    };
    fetchHome();
  }, [username]);

  // 💾 Salvar alterações (somente dono)
  const handleSave = async () => {
    if (!userHome || !isOwner) return;

    const res = await fetch(`/api/home/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userHome),
    });

    if (res.ok) setIsEditing(false);
    else {
      const data = await res.json();
      alert(data.error || "Erro ao salvar alterações.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Carregando...
      </div>
    );

  if (!userHome)
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Usuário não encontrado.
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-pink-300 to-purple-300 text-gray-900 relative pb-24 overflow-hidden">
      <FallingHearts />

      {isOwner && (
        <div
          className={`flex gap-3 p-4 transition-all duration-300 ${
            isEditing
              ? "fixed bottom-4 right-4 z-50"
              : "absolute bottom-4 left-1/2 -translate-x-1/2"
          }`}
        >
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-pink-100/60 hover:bg-pink-50 text-pink-400 px-5 py-2 rounded-full font-semibold transition shadow-lg"
              >
                Salvar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-pink-100/60 hover:bg-pink-50 text-pink-400 px-5 py-2 rounded-full font-semibold transition shadow-lg"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-pink-100/60 text-pink-400 px-6 py-2 rounded-full font-semibold shadow-md hover:bg-pink-50 transition"
            >
              Editar
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-8 mx-auto max-w-5xl px-4 pt-8 relative z-10">
        <HeroSection
          isEditing={isOwner && isEditing}
          name1={userHome.name1}
          setName1={(v: string) => setUserHome({ ...userHome, name1: v })}
          name2={userHome.name2}
          setName2={(v: string) => setUserHome({ ...userHome, name2: v })}
          startDate={new Date(userHome.start_date)}
          setStartDate={(v: Date) => setUserHome({ ...userHome, start_date: v })}
          daysTogether={Math.floor(
            (new Date().getTime() - new Date(userHome.start_date).getTime()) /
              (1000 * 60 * 60 * 24)
          )}
        />
        <RelationshipTimer
          startDate={new Date(userHome.start_date)}
          setStartDate={(v: Date) => setUserHome({ ...userHome, start_date: v })}
          isEditing={isOwner && isEditing}
          title={userHome.timer_title}
          setTitle={(v: string) => setUserHome({ ...userHome, timer_title: v })}
        />
        <DescriptionSection
          isEditing={isOwner && isEditing}
          title={userHome.story_title}
          setTitle={(v: string) => setUserHome({ ...userHome, story_title: v })}
          description={userHome.description}
          setDescription={(v: string) => setUserHome({ ...userHome, description: v })}
        />
        <ImageSlider
          isEditing={isOwner && isEditing}
          images={userHome.images}
          setImages={(v: string[]) => setUserHome({ ...userHome, images: v })}
        />
        <PlaylistSection
          title={userHome.playlist_title}
          setTitle={(v: string) => setUserHome({ ...userHome, playlist_title: v })}
          audioUrl={userHome.playlist_audio_url}
          setAudioUrl={(v: string) => setUserHome({ ...userHome, playlist_audio_url: v })}
          isEditing={isOwner && isEditing}
        />
      </div>
    </div>
  );
}
