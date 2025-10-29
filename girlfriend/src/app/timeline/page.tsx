"use client";

import { useState } from "react";

type Post = {
  id: number;
  title: string;
  description: string;
  images?: string[];
  createdAt: Date;
};

export default function TimelinePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({ title: "", description: "", images: [] as string[] });
  const [showForm, setShowForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [filterDate, setFilterDate] = useState<string>("");

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));

    if (isEditing && editingPost) {
      const updatedImages = [...(editingPost.images ?? []), ...newImages];
      setEditingPost({ ...editingPost, images: updatedImages });
      // Ajusta índice se necessário
      setCurrentImageIndex((prev) => ({
        ...prev,
        [editingPost.id]: Math.min(prev[editingPost.id] ?? 0, updatedImages.length - 1),
      }));
    } else {
      setNewPost({ ...newPost, images: [...newPost.images, ...newImages] });
    }
  };

  const handleDeleteImage = (index: number, isEditing = false) => {
    if (isEditing && editingPost) {
      const updated = [...(editingPost.images ?? [])];
      updated.splice(index, 1);
      setEditingPost({ ...editingPost, images: updated });

      // Ajusta índice da imagem
      setCurrentImageIndex((prev) => {
        const currentIndex = prev[editingPost.id] ?? 0;
        const newIndex = currentIndex >= updated.length ? 0 : currentIndex;
        return { ...prev, [editingPost.id]: newIndex };
      });
    } else {
      const updated = [...newPost.images];
      updated.splice(index, 1);
      setNewPost({ ...newPost, images: updated });
    }
  };

  const handleSavePost = () => {
    if (editingPost) {
      setPosts(posts.map((p) => (p.id === editingPost.id ? editingPost : p)));
      setEditingPost(null);
    } else {
      setPosts([
        ...posts,
        { id: Date.now(), ...newPost, createdAt: new Date() },
      ]);
      setNewPost({ title: "", description: "", images: [] });
      setShowForm(false);
    }
  };

  const handleNextImage = (postId: number) => {
    setCurrentImageIndex((prev) => {
      const post = posts.find((p) => p.id === postId);
      if (!post?.images) return prev;
      const nextIndex = ((prev[postId] ?? 0) + 1) % post.images.length;
      return { ...prev, [postId]: nextIndex };
    });
  };

  const handlePrevImage = (postId: number) => {
    setCurrentImageIndex((prev) => {
      const post = posts.find((p) => p.id === postId);
      if (!post?.images) return prev;
      const length = post.images.length;
      const nextIndex = ((prev[postId] ?? 0) - 1 + length) % length;
      return { ...prev, [postId]: nextIndex };
    });
  };

  const formatDate = (date: Date) =>
    `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  // Filtrar e ordenar posts
  let displayedPosts = [...posts];
  if (filterDate) {
    displayedPosts = displayedPosts.filter(
      (p) => p.createdAt.toISOString().split("T")[0] === filterDate
    );
  }
  displayedPosts.sort((a, b) =>
    sortOrder === "recent" ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime()
  );

  const clearFilters = () => {
    setFilterDate("");
    setSortOrder("recent");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-pink-100 to-pink-300 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-center items-center">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "recent" | "oldest")}
            className="p-2 rounded-lg border border-pink-300 bg-pink-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 rounded-lg border border-pink-300 bg-pink-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button
            onClick={clearFilters}
            className="p-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition"
          >
            Limpar filtros
          </button>
        </div>

        {/* Botão Nova Publicação */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingPost(null); // sair do modo edição ao adicionar nova publicação
          }}
          className="w-full mb-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg shadow-md transition"
        >
          {showForm ? "Cancelar" : "Nova Publicação"}
        </button>

        {/* Formulário de nova publicação */}
        {showForm && (
          <div className="bg-white p-4 rounded-lg shadow-lg mb-6 border border-pink-200">
            <input
              type="text"
              placeholder="Título"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full mb-3 p-2 rounded-lg border border-pink-300 bg-pink-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <textarea
              placeholder="Descrição"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              className="w-full mb-3 p-2 rounded-lg border border-pink-300 bg-pink-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <label className="flex justify-center items-center mb-3 w-full font-medium bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer transition">
              Adicionar Fotos
              <input type="file" multiple accept="image/*" onChange={(e) => handleAddImage(e)} className="hidden" />
            </label>
            {newPost.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {newPost.images.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      alt=""
                      className="w-24 h-24 object-cover rounded-lg border border-pink-200"
                    />
                    <button
                      onClick={() => handleDeleteImage(i)}
                      className="absolute top-1 right-1 bg-black/40 text-white text-xs px-2 py-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleSavePost}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Salvar Publicação
            </button>
          </div>
        )}

        {/* Lista de publicações */}
        {displayedPosts.map((post) => {
          const index = currentImageIndex[post.id] ?? 0;
          const hasImages = post.images && post.images.length > 0;
          const isEditingThis = editingPost?.id === post.id;

          return (
            <div
              key={post.id}
              className="bg-white rounded-lg p-4 mb-6 shadow-lg border border-pink-200 relative overflow-hidden"
            >
              {/* Menu 3 pontinhos */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setMenuOpenId(menuOpenId === post.id ? null : post.id)}
                  className="text-gray-500 font-bold"
                >
                  ⋮
                </button>
                {menuOpenId === post.id && (
                  <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 flex flex-col">
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setShowForm(false);
                        setMenuOpenId(null);
                      }}
                      className="px-3 py-1 hover:bg-pink-50 text-pink-500 text-left"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setPosts(posts.filter((p) => p.id !== post.id))}
                      className="px-3 py-1 hover:bg-red-50 text-red-500 text-left"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-pink-600">{post.title}</h2>
              <p className="text-gray-700 mb-3">{post.description}</p>

              {/* Imagens */}
              {hasImages && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <img
                    src={post.images![index]}
                    alt=""
                    className="w-full h-full object-cover transition duration-500"
                  />
                  {index > 0 && (
                    <button
                      onClick={() => handlePrevImage(post.id)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white text-2xl px-3 py-1 rounded-full hover:bg-black/60 transition"
                    >
                      ⟨
                    </button>
                  )}
                  {index < (post.images?.length ?? 0) - 1 && (
                    <button
                      onClick={() => handleNextImage(post.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white text-2xl px-3 py-1 rounded-full hover:bg-black/60 transition"
                    >
                      ⟩
                    </button>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">{formatDate(post.createdAt)}</p>

              {/* Edição da publicação */}
              {isEditingThis && (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-pink-200 mt-4 min-h-[200px]">
                  <input
                    type="text"
                    value={editingPost?.title}
                    onChange={(e) =>
                      setEditingPost(editingPost ? { ...editingPost, title: e.target.value } : null)
                    }
                    className="w-full mb-3 p-2 rounded-lg border border-pink-300 bg-pink-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <textarea
                    value={editingPost?.description}
                    onChange={(e) =>
                      setEditingPost(editingPost ? { ...editingPost, description: e.target.value } : null)
                    }
                    className="w-full mb-3 p-2 rounded-lg border border-pink-300 bg-pink-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />

                  <div className="flex flex-wrap gap-2 mb-3">
                    {editingPost?.images?.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          alt=""
                          className="w-24 h-24 object-cover rounded-lg border border-pink-200"
                        />
                        <button
                          onClick={() => handleDeleteImage(i, true)}
                          className="absolute top-1 right-1 bg-black/40 text-white text-xs px-2 py-1 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="flex justify-center items-center mb-3 w-full font-medium bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer transition">
                    Adicionar mais fotos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleAddImage(e, true)}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleSavePost}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Salvar Alterações
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
