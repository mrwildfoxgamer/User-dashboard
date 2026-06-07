import { useState, useMemo } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserCard from '../components/UserCard';
import Toolbar from '../components/Toolbar';
import SkeletonGrid from '../components/SkeletonGrid';
import ErrorState from '../components/ErrorState';
import { filterAndSort, getUnique, DEFAULT_FILTERS } from '../utils/filterUsers';
import type { FilterState } from '../utils/filterUsers';

export default function Home() {
  const { data: users, loading, error, retry } = useUsers();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const cities = useMemo(() => getUnique(users ?? [], 'city'), [users]);
  const companies = useMemo(() => getUnique(users ?? [], 'company'), [users]);

  const filtered = useMemo(
    () => filterAndSort(users ?? [], filters),
    [users, filters]
  );

  const patch = (p: Partial<FilterState>) => setFilters((f) => ({ ...f, ...p }));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Directory</h1>
          <p className="text-sm text-slate-400 mt-0.5">Browse, search, and filter all users</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* Toolbar — only when we have data */}
        {!loading && !error && (
          <Toolbar
            filters={filters}
            cities={cities}
            companies={companies}
            totalCount={users?.length ?? 0}
            filteredCount={filtered.length}
            onChange={patch}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        )}

        {/* States */}
        {loading && <SkeletonGrid />}

        {error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="text-4xl">🔎</p>
            <p className="font-semibold text-slate-600">No users match your filters</p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((user) => (
              <UserCard key={user.id} user={user} searchTerm={filters.search} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
