"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Post = {
  id: string;
  text?: string;
  image?: string | null;
  date: string;
};

export default function TimelinePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddPost = () => {
    if (!text && !image) {
      alert("Por favor, adicione uma descrição ou uma imagem antes de postar.");
      return;
    }

    const newPost: Post = {
      id: uuidv4(),
      text: text.trim() ? text : undefined,
      image: image ?? null,
      date: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev]);
    setText("");
    setImage(null);
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handleEdit = (id: string, currentText: string | undefined) => {
    setEditingId(id);
    setEditedText(currentText || "");
  };

  const handleSaveEdit = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, text: editedText } : p))
    );
    setEditingId(null);
  };

  const filteredPosts = posts
    .filter((p) => {
      if (!search) return true;
      const dateString = new Date(p.date).toLocaleDateString("pt-BR");
      return dateString.includes(search);
    })
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-purple-200 p-6">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
        Nossa Linha do Tempo 💕
      </h1>

      {/* Barra de filtro */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Pesquisar por data (ex: 29/10/2025)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-lg border border-pink-400 w-full md:w-1/2"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          className="p-2 rounded-lg border border-pink-400"
        >
          <option value="newest">Mais recentes primeiro</option>
          <option value="oldest">Mais antigas primeiro</option>
        </select>
      </div>

      {/* Criar nova postagem */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
        <textarea
          placeholder="Escreva algo especial..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 mb-3 resize-none"
          rows={3}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-3"
        />

        {image && (
          <img
            src={image}
            alt="Preview"
            className="w-full h-60 object-cover rounded-xl mb-3"
          />
        )}

        <button
          onClick={handleAddPost}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full transition"
        >
          Publicar
        </button>
      </div>

      {/* Linha do tempo */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhuma lembrança adicionada ainda 💭
          </p>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-md p-6 relative"
            >
              <p className="text-sm text-gray-500 mb-2">
                {new Date(post.date).toLocaleString("pt-BR")}
              </p>

              {/* Campo de texto editável */}
              {editingId === post.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full p-3 rounded-lg border border-pink-300 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleSaveEdit(post.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {post.text && (
                    <p className="text-gray-800 text-lg mb-3 whitespace-pre-wrap">
                      {post.text}
                    </p>
                  )}

                  {post.image && (
                    <img
                      src={post.image}
                      alt="Postagem"
                      className="w-full h-80 object-cover rounded-xl mb-3"
                    />
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(post.id, post.text)}
                      className="text-blue-500 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}