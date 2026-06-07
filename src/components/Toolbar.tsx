import type { FilterState, SortField } from '../utils/filterUsers';

interface Props {
  filters: FilterState;
  cities: string[];
  companies: string[];
  totalCount: number;
  filteredCount: number;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

export default function Toolbar({
  filters,
  cities,
  companies,
  totalCount,
  filteredCount,
  onChange,
  onReset,
}: Props) {
  const hasActiveFilters =
    filters.search || filters.city || filters.company;

  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'username', label: 'Username' },
    { value: 'email', label: 'Email' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Search + sort */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search name, username, or email…"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm
                       text-slate-700 placeholder-slate-400 shadow-sm outline-none
                       focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort field */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
          <span className="text-xs text-slate-400 mr-1 whitespace-nowrap">Sort by</span>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ sortField: opt.value })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filters.sortField === opt.value
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort order toggle */}
        <button
          onClick={() =>
            onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
          }
          title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5
                     text-sm text-slate-600 shadow-sm hover:bg-slate-50 transition"
        >
          <span>{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
          <span className="hidden sm:inline">{filters.sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
        </button>
      </div>

      {/* Row 2: Dropdowns + results count */}
      <div className="flex flex-wrap items-center gap-3">
        {/* City filter */}
        <select
          value={filters.city}
          onChange={(e) => onChange({ city: e.target.value })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600
                     shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Company filter */}
        <select
          value={filters.company}
          onChange={(e) => onChange({ company: e.target.value })}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600
                     shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
        >
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-600
                       hover:bg-rose-100 transition"
          >
            Clear filters
          </button>
        )}

        {/* Results count */}
        <span className="ml-auto text-sm text-slate-400">
          {filteredCount === totalCount ? (
            <>{totalCount} users</>
          ) : (
            <>
              <span className="font-semibold text-slate-600">{filteredCount}</span> of {totalCount} users
            </>
          )}
        </span>
      </div>
    </div>
  );
}
