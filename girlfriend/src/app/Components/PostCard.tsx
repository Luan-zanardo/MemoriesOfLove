"use client";

import Image from "next/image";
import { Post } from "../timeline/page";

type Props = {
  post: Post;
  currentImageIndex: { [key: number]: number };
  handleNextImage: (id: number) => void;
  handlePrevImage: (id: number) => void;
  menuOpenId: number | null;
  setMenuOpenId: (id: number | null) => void;
  setEditingPost: (p: Post | null) => void;
  setShowForm: (b: boolean) => void;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  posts: Post[];
  editingPost: Post | null;
  handleAddImage: (e: React.ChangeEvent<HTMLInputElement>, isEditing?: boolean) => void;
  handleDeleteImage: (index: number, isEditing?: boolean) => void;
  handleSavePost: () => void;
};

export default function PostCard({
  post,
  currentImageIndex,
  handleNextImage,
  handlePrevImage,
  menuOpenId,
  setMenuOpenId,
  setEditingPost,
  setShowForm,
  setPosts,
  posts,
  editingPost,
  handleAddImage,
  handleDeleteImage,
  handleSavePost,
}: Props) {
  const index = currentImageIndex[post.id] ?? 0;
  const hasImages = post.images && post.images.length > 0;
  const isEditingThis = editingPost?.id === post.id;

  const formatDate = (date: Date) =>
    `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <div className="bg-pink-100/60 rounded-2xl p-4 mb-6 shadow-lg border border-pink-200 relative overflow-hidden transition-all">
      {/* Menu */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setMenuOpenId(menuOpenId === post.id ? null : post.id)}
          className="text-gray-600 font-bold hover:text-pink-600 transition"
        >
          ⋮
        </button>
        {menuOpenId === post.id && (
          <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg z-10 flex flex-col overflow-hidden">
            <button
              onClick={() => {
                setEditingPost(post);
                setShowForm(false);
                setMenuOpenId(null);
              }}
              className="px-3 py-2 bg-pink-300 hover:bg-pink-400 text-white font-semibold text-left transition"
            >
              Editar
            </button>
            <button
              onClick={() => setPosts(posts.filter((p) => p.id !== post.id))}
              className="px-3 py-2 bg-pink-300 hover:bg-pink-400 text-white font-semibold text-left transition"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {/* Título e descrição */}
      <h2 className="text-xl font-bold text-pink-600">{post.title}</h2>
      <p className="text-gray-700 mb-3">{post.description}</p>

      {/* Imagem */}
      {hasImages && (
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md bg-white">
          {post.images?.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`Imagem ${i + 1}`}
              fill
              className={`object-cover absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Botões de navegação com transição igual ao ImageSlider */}
          {index > 0 && (
            <button
              onClick={() => handlePrevImage(post.id)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-pink-400 p-2 rounded-full shadow-md hover:bg-pink-300 transition"
            >
              ◀
            </button>
          )}
          {index < (post.images?.length ?? 0) - 1 && (
            <button
              onClick={() => handleNextImage(post.id)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-pink-400 p-2 rounded-full shadow-md hover:bg-pink-300 transition"
            >
              ▶
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-pink-400 font-semibold mt-2">{formatDate(post.createdAt)}</p>

      {/* Edição inline */}
      {isEditingThis && (
        <div className="bg-pink-100/60 p-4 rounded-2xl shadow-md mt-4 transition-all">
          <input
            type="text"
            value={editingPost?.title}
            onChange={(e) =>
              setEditingPost(editingPost ? { ...editingPost, title: e.target.value } : null)
            }
            className="w-full mb-3 p-2 rounded-lg border border-pink-300 bg-pink-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <textarea
            value={editingPost?.description}
            onChange={(e) =>
              setEditingPost(editingPost ? { ...editingPost, description: e.target.value } : null)
            }
            className="w-full mb-3 p-2 rounded-lg border border-pink-300 bg-pink-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {/* Galeria de edição */}
          <div className="flex flex-wrap gap-2 mb-3 justify-center">
            {editingPost?.images?.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-pink-200 shadow-md bg-white">
                <Image src={img} alt="" fill className="object-cover" />
                <button
                  onClick={() => handleDeleteImage(i, true)}
                  className="absolute top-1 right-1 bg-black/50 text-white w-6 h-6 rounded-lg flex items-center justify-center text-xs shadow-md hover:bg-black/70 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Adicionar imagem */}
          <label className="flex justify-center items-center mb-3 w-full font-medium bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer transition text-center shadow-md">
            Adicionar mais fotos
            <input type="file" multiple accept="image/*" onChange={(e) => handleAddImage(e, true)} className="hidden" />
          </label>

          {/* Botão de salvar */}
          <button
            onClick={handleSavePost}
            className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            Salvar Alterações
          </button>
        </div>
      )}
    </div>
  );
}