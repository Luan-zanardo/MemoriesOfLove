"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { QRCodeCanvas } from "qrcode.react";

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
  const [showQRCode, setShowQRCode] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionUser(session?.user ?? null);
    };
    getSession();
  }, []);

  const isOwner = sessionUser?.id && userHome?.user_id === sessionUser.id;

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

  const handleDownloadQRCode = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${username}_qrcode.png`;
    link.click();
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

      {/* Botões do dono da página */}
      {isOwner && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row justify-center gap-3 p-4 items-center w-full max-w-xs sm:max-w-sm z-50">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-pink-100 hover:bg-pink-50 text-pink-400 px-4 py-2 rounded-full font-semibold shadow-lg text-center min-w-20"
              >
                Salvar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-pink-100 hover:bg-pink-50 text-pink-400 px-4 py-2 rounded-full font-semibold shadow-lg text-center min-w-20"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-pink-100 text-pink-400 px-4 py-2 rounded-full font-semibold shadow-md hover:bg-pink-50 text-center min-w-20"
              >
                Editar
              </button>
              <button
                onClick={() => setShowQRCode(true)}
                className="flex-1 bg-pink-100 text-pink-400 px-4 py-2 rounded-full font-semibold shadow-md hover:bg-pink-50 text-center min-w-20"
              >
                QR Code
              </button>
            </>
          )}
        </div>
      )}

      {/* Modal do QR Code */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4 relative">
            <button
              onClick={() => setShowQRCode(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              ×
            </button>
            <QRCodeCanvas
              ref={qrRef}
              value={window.location.href}
              size={200}
              level="H"
              includeMargin
            />
            <p className="text-gray-700 text-center text-sm">
              Escaneie ou baixe para compartilhar esta página
            </p>
            <button
              onClick={handleDownloadQRCode}
              className="bg-pink-100 text-pink-400 px-4 py-2 rounded-full font-semibold shadow-md hover:bg-pink-50 transition"
            >
              Baixar QR Code
            </button>
          </div>
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
