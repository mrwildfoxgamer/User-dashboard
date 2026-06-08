import { memo, useState, useEffect, useCallback } from 'react';
import type { FilterState, SortField } from '../utils/filterUsers';
import type { ViewMode } from '../hooks/useViewMode';
import { useDebounce } from '../hooks/useDebounce';

interface Props {
  filters: FilterState;
  cities: string[];
  companies: string[];
  totalCount: number;
  filteredCount: number;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  viewMode: ViewMode;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  onToggleFavoritesFilter: () => void;
  onExportCsv: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'username', label: 'Username' },
  { value: 'email', label: 'Email' },
];

const selectCls =
  'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:focus:border-slate-500';

const Toolbar = memo(function Toolbar({
  filters,
  cities,
  companies,
  totalCount,
  filteredCount,
  favoritesCount,
  showFavoritesOnly,
  viewMode,
  onChange,
  onReset,
  onToggleFavoritesFilter,
  onExportCsv,
  onViewModeChange,
}: Props) {
  // Local input state — debounced before it hits the filter
  const [inputVal, setInputVal] = useState(filters.search);
  const debouncedInput = useDebounce(inputVal, 350);

  // Sync debounced value to filters
  useEffect(() => {
    onChange({ search: debouncedInput });
  }, [debouncedInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep local input in sync when filters are externally reset
  useEffect(() => {
    if (filters.search === '') setInputVal('');
  }, [filters.search]);

  const handleSortField = useCallback(
    (f: SortField) => onChange({ sortField: f }),
    [onChange],
  );
  const handleSortOrder = useCallback(
    () =>
      onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' }),
    [onChange, filters.sortOrder],
  );
  const handleCity = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      onChange({ city: e.target.value }),
    [onChange],
  );
  const handleCompany = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      onChange({ company: e.target.value }),
    [onChange],
  );
  const handleClearSearch = useCallback(() => {
    setInputVal('');
    onChange({ search: '' });
  }, [onChange]);

  const hasActiveFilters =
    filters.search || filters.city || filters.company || showFavoritesOnly;

  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      {/* Row 1: Search + sort + view toggle */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search name, username, or email…"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            aria-label="Search users"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm
                       text-slate-700 placeholder-slate-400 shadow-sm outline-none
                       focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition
                       dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-500"
          />
          {inputVal && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition dark:hover:text-slate-300"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort field */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <span className="text-xs text-slate-400 mr-1 whitespace-nowrap select-none dark:text-slate-500">
            Sort by
          </span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSortField(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filters.sortField === opt.value
                  ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort order */}
        <button
          onClick={handleSortOrder}
          title={
            filters.sortOrder === 'asc'
              ? 'Switch to descending'
              : 'Switch to ascending'
          }
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5
                     text-sm text-slate-600 shadow-sm hover:bg-slate-50 transition select-none
                     dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <span>{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
          <span className="hidden sm:inline">
            {filters.sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </span>
        </button>

        {/* View mode toggle */}
        <div className="flex rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-800">
          <button
            onClick={() => onViewModeChange('card')}
            aria-label="Card view"
            title="Card view"
            className={`px-3 py-2 text-sm transition ${
              viewMode === 'card'
                ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            ⊞
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            aria-label="Table view"
            title="Table view"
            className={`px-3 py-2 text-sm transition border-l border-slate-200 dark:border-slate-700 ${
              viewMode === 'table'
                ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            ≡
          </button>
        </div>
      </div>

      {/* Row 2: Filters + count + CSV */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={filters.city} onChange={handleCity} className={selectCls} aria-label="Filter by city">
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={filters.company} onChange={handleCompany} className={selectCls} aria-label="Filter by company">
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Favorites toggle */}
        <button
          onClick={onToggleFavoritesFilter}
          className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition
            ${
              showFavoritesOnly
                ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
        >
          <span>★</span>
          <span>
            Favorites{favoritesCount > 0 ? ` (${favoritesCount})` : ''}
          </span>
        </button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-600
                       hover:bg-rose-100 transition dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40"
          >
            Clear filters
          </button>
        )}

        {/* Count */}
        <span className="text-sm text-slate-400 dark:text-slate-500">
          {filteredCount === totalCount ? (
            <>{totalCount} users</>
          ) : (
            <>
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                {filteredCount}
              </span>{' '}
              of {totalCount} users
            </>
          )}
        </span>

        {/* CSV Export */}
        <button
          onClick={onExportCsv}
          title="Export filtered users to CSV"
          className="ml-auto flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600
                     hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          <span>⬇</span>
          <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>
    </div>
  );
});

export default Toolbar;
