"use client";

export default function DescriptionSection({
  isEditing,
  title,
  setTitle,
  description,
  setDescription,
}: any) {
  return (
    <section className="bg-white/70 text-gray-800 py-16 px-6 md:px-24 text-center">
      {isEditing ? (
        <>
          <input
            className="text-2xl md:text-3xl font-bold mb-4 w-full text-center border-b-2 border-gray-400 bg-transparent outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full text-base md:text-lg bg-transparent border rounded-lg p-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </>
      ) : (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
          <p className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </>
      )}
    </section>
  );
}
