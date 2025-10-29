"use client";

export default function DescriptionSection({
  isEditing,
  title,
  setTitle,
  description,
  setDescription,
}: any) {
  return (
    <section className="w-full bg-pink-100/60 rounded-3xl shadow-lg p-8 md:p-12 text-gray-800 text-center">
      {isEditing ? (
        <>
          <input
            className="text-2xl md:text-3xl font-bold mb-4 w-full text-center border-b-2 border-pink-300 bg-transparent outline-none focus:border-pink-500 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título..."
          />
          <textarea
            className="w-full text-base md:text-lg bg-white/50 border border-pink-200 rounded-xl p-4 resize-none focus:ring-2 focus:ring-pink-400 outline-none transition"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite a descrição..."
          />
        </>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-pink-700">
            {title}
          </h2>
          <p className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto text-gray-700">
            {description}
          </p>
        </>
      )}
    </section>
  );
}
