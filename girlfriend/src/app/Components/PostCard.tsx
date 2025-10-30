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
    <div className="bg-white rounded-lg p-4 mb-6 shadow-lg border border-pink-200 relative overflow-hidden">
      {/* Menu */}
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

      {/* Imagem */}
      {hasImages && (
        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
          <img src={post.images![index]} alt="" className="w-full h-full object-cover transition duration-500" />
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

      {/* Edição inline */}
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
                <img src={img} alt="" className="w-24 h-24 object-cover rounded-lg border border-pink-200" />
                <button
                  onClick={() => handleDeleteImage(i, true)}
                  className="absolute top-1 right-1 bg-black/40 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <label className="flex justify-center items-center mb-3 w-full font-medium bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer transition text-center">
            Adicionar mais fotos
            <input type="file" multiple accept="image/*" onChange={(e) => handleAddImage(e, true)} className="hidden" />
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
}