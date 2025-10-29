"use client";

export default function PlaylistSection() {
  return (
    <section className="py-16 bg-white text-center px-4">
      <h3 className="text-xl md:text-2xl font-bold mb-6">
        🎶 Nossa música preferida — Eduardo e Mônica
      </h3>
      <div className="flex justify-center">
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/track/6xD6Fd0r7l1dZfr1f4Hf1O?utm_source=generator"
          width="90%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
}
