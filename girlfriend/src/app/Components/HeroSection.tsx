"use client";

export default function HeroSection({
  isEditing,
  name1,
  setName1,
  name2,
  setName2,
  startDate,
  setStartDate,
  daysTogether,
}: any) {
  return (
    <section className="flex flex-col items-center justify-center h-[90vh] px-4 text-center text-white">
      {isEditing ? (
        <>
          <input
            className="text-4xl md:text-6xl font-bold bg-transparent border-b-2 border-white text-center outline-none w-full max-w-md"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
          />
          <span className="text-3xl mt-2">&</span>
          <input
            className="text-4xl md:text-6xl font-bold bg-transparent border-b-2 border-white text-center outline-none w-full max-w-md"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
          />
          <div className="mt-4 text-sm md:text-base">
            <label className="opacity-90">Data de Início:</label>
            <input
              type="date"
              className="ml-2 px-2 py-1 rounded text-gray-700"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-5xl md:text-7xl font-bold">{name1} & {name2}</h1>
          <p className="mt-4 text-lg md:text-2xl">
            💫 Juntos há <span className="font-bold">{daysTogether}</span> dias 💫
          </p>
        </>
      )}
    </section>
  );
}
