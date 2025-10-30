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
    <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-center items-center">
      
      {/* Select */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as "recent" | "oldest")}
        className="w-full sm:w-48 h-12 px-3 rounded-lg border border-pink-300 bg-pink-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
      >
        <option value="recent">Mais recentes</option>
        <option value="oldest">Mais antigos</option>
      </select>

      {/* Input de data */}
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="w-full sm:w-48 h-12 px-3 rounded-lg border border-pink-300 bg-pink-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
      />

      {/* Botão */}
      <button
        onClick={clearFilters}
        className="w-full sm:w-48 h-12 px-3 bg-pink-200 hover:bg-pink-100 text-pink-400 font-semibold rounded-lg shadow-sm transition"
      >
        Limpar filtros
      </button>
    </div>
  );
}
