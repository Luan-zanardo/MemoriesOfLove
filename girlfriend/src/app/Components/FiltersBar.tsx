type Props = {
  sortOrder: "recent" | "oldest";
  setSortOrder: (value: "recent" | "oldest") => void;
  filterDate: string;
  setFilterDate: (value: string) => void;
  clearFilters: () => void;
};

export default function FiltersBar({ sortOrder, setSortOrder, filterDate, setFilterDate, clearFilters }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-center items-center">
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as "recent" | "oldest")}
        className="p-2 rounded-lg border border-pink-300 bg-pink-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
      >
        <option value="recent">Mais recentes</option>
        <option value="oldest">Mais antigos</option>
      </select>

      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="p-2 rounded-lg border border-pink-300 bg-pink-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      <button
        onClick={clearFilters}
        className="p-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition"
      >
        Limpar filtros
      </button>
    </div>
  );
}
