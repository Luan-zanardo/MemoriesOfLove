type Props = {
  newPost: { title: string; description: string; images: string[] };
  setNewPost: (p: { title: string; description: string; images: string[] }) => void;
  handleAddImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImage: (index: number) => void;
  handleSavePost: () => void;
};

export default function PostForm({ newPost, setNewPost, handleAddImage, handleDeleteImage, handleSavePost }: Props) {
  return (
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
      <label className="flex justify-center items-center mb-3 w-full font-medium bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer transition text-center">
        Adicionar Fotos
        <input type="file" multiple accept="image/*" onChange={(e) => handleAddImage(e)} className="hidden" />
      </label>

      {newPost.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {newPost.images.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} alt="" className="w-24 h-24 object-cover rounded-lg border border-pink-200" />
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
  );
}