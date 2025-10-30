type Props = {
  sortOrder: "recent" | "oldest";
  setSortOrder: (value: "recent" | "oldest") => void;
  filterDate: string;
  setFilterDate: (value: string) => void;
  clearFilters: () => void;
};

export default function FiltersBar({
  sortOrder,
  setSortOrder,
  filterDate,
  setFilterDate,
  clearFilters,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-4 justify-center items-center">
      
      {/* Select */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as "recent" | "oldest")}
        className="w-48 h-12 px-3 rounded-lg border border-pink-300 bg-pink-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 appearance-none"
      >
        <option value="recent">Mais recentes</option>
        <option value="oldest">Mais antigos</option>
      </select>

      {/* Input de data */}
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="w-48 h-12 px-3 rounded-lg border border-pink-300 bg-pink-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      {/* Botão */}
      <button
        onClick={clearFilters}
        className="w-48 h-12 px-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-lg transition"
      >
        Limpar filtros
      </button>
    </div>
  );
}
