"use client";

import { useState } from "react";
import FiltersBar from "../Components/FiltersBar";
import PostForm from "../Components/PostForm";
import PostCard from "../Components/PostCard";

export type Post = {
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

  // --- Funções auxiliares ---
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));

    if (isEditing && editingPost) {
      const updatedImages = [...(editingPost.images ?? []), ...newImages];
      setEditingPost({ ...editingPost, images: updatedImages });
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
      setCurrentImageIndex((prev) => ({ ...prev, [editingPost.id]: 0 }));
    } else {
      const updated = [...newPost.images];
      updated.splice(index, 1);
      setNewPost({ ...newPost, images: updated });
    }
  };

  const handleSavePost = () => {
    const empty =
      (!editingPost && !newPost.title.trim() && !newPost.description.trim() && newPost.images.length === 0) ||
      (editingPost && !editingPost.title.trim() && !editingPost.description.trim() && (editingPost.images?.length ?? 0) === 0);

    if (empty) return alert("Não é possível salvar uma publicação vazia!");

    if (editingPost) {
      setPosts(posts.map((p) => (p.id === editingPost.id ? editingPost : p)));
      setEditingPost(null);
    } else {
      setPosts([...posts, { id: Date.now(), ...newPost, createdAt: new Date() }]);
      setNewPost({ title: "", description: "", images: [] });
      setShowForm(false);
    }
  };

  const handleNextImage = (postId: number) => {
    setCurrentImageIndex((prev) => {
      const post = posts.find((p) => p.id === postId);
      if (!post?.images) return prev;
      const next = ((prev[postId] ?? 0) + 1) % post.images.length;
      return { ...prev, [postId]: next };
    });
  };

  const handlePrevImage = (postId: number) => {
    setCurrentImageIndex((prev) => {
      const post = posts.find((p) => p.id === postId);
      if (!post?.images) return prev;
      const len = post.images.length;
      const next = ((prev[postId] ?? 0) - 1 + len) % len;
      return { ...prev, [postId]: next };
    });
  };

  // --- Filtros e ordenação ---
  let displayedPosts = [...posts];
  if (filterDate) {
    displayedPosts = displayedPosts.filter((p) => p.createdAt.toISOString().split("T")[0] === filterDate);
  }
  displayedPosts.sort((a, b) =>
    sortOrder === "recent" ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime()
  );

  const clearFilters = () => {
    setFilterDate("");
    setSortOrder("recent");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-300 to-purple-300 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Filtros */}
        <FiltersBar
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          clearFilters={clearFilters}
        />

        {/* Botão Nova Publicação */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingPost(null);
          }}
          className="w-full mb-6 bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 rounded-full shadow-md transition"
        >
          {showForm ? "Cancelar" : "Nova Publicação"}
        </button>

        {/* Formulário */}
        {showForm && (
          <PostForm
            newPost={newPost}
            setNewPost={setNewPost}
            handleAddImage={handleAddImage}
            handleDeleteImage={handleDeleteImage}
            handleSavePost={handleSavePost}
          />
        )}

        {/* Lista de Posts */}
        {displayedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentImageIndex={currentImageIndex}
            handleNextImage={handleNextImage}
            handlePrevImage={handlePrevImage}
            menuOpenId={menuOpenId}
            setMenuOpenId={setMenuOpenId}
            setEditingPost={setEditingPost}
            setShowForm={setShowForm}
            setPosts={setPosts}
            posts={posts}
            editingPost={editingPost}
            handleAddImage={handleAddImage}
            handleDeleteImage={handleDeleteImage}
            handleSavePost={handleSavePost}
          />
        ))}
      </div>
    </div>
  );
}