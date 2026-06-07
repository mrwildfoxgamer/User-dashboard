import { useState, useMemo, useCallback } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useFavorites } from '../hooks/useFavorites';
import { usePagination } from '../hooks/usePagination';
import UserCard from '../components/UserCard';
import Toolbar from '../components/Toolbar';
import SkeletonGrid from '../components/SkeletonGrid';
import ErrorState from '../components/ErrorState';
import Pagination from '../components/Pagination';
import { filterAndSort, getUnique, DEFAULT_FILTERS } from '../utils/filterUsers';
import type { FilterState } from '../utils/filterUsers';

export default function Home() {
  const { data: users, loading, error, retry } = useUsers();
  const { favorites, toggle: toggleFav, isFavorite } = useFavorites();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const cities = useMemo(() => getUnique(users ?? [], 'city'), [users]);
  const companies = useMemo(() => getUnique(users ?? [], 'company'), [users]);

  const filtered = useMemo(() => {
    let result = filterAndSort(users ?? [], filters);
    if (showFavoritesOnly) result = result.filter((u) => favorites.has(u.id));
    return result;
  }, [users, filters, showFavoritesOnly, favorites]);

  const pagination = usePagination(filtered);

  const patch = useCallback(
    (p: Partial<FilterState>) => setFilters((f) => ({ ...f, ...p })),
    []
  );

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setShowFavoritesOnly(false);
  }, []);

  const handleToggleFavoritesFilter = useCallback(() => {
    setShowFavoritesOnly((v) => !v);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Directory</h1>
            <p className="text-sm text-slate-400 mt-0.5">Browse, search, and filter all users</p>
          </div>
          {favorites.size > 0 && (
            <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm text-amber-700">
              <span>★</span>
              <span>{favorites.size} saved</span>
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* Toolbar */}
        {!loading && !error && (
          <Toolbar
            filters={filters}
            cities={cities}
            companies={companies}
            totalCount={users?.length ?? 0}
            filteredCount={filtered.length}
            favoritesCount={favorites.size}
            showFavoritesOnly={showFavoritesOnly}
            onChange={patch}
            onReset={handleReset}
            onToggleFavoritesFilter={handleToggleFavoritesFilter}
          />
        )}

        {/* Loading */}
        {loading && <SkeletonGrid />}

        {/* Error */}
        {error && <ErrorState message={error} onRetry={retry} />}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="text-4xl">{showFavoritesOnly ? '★' : '🔎'}</p>
            <p className="font-semibold text-slate-600">
              {showFavoritesOnly ? 'No favorites yet' : 'No users match your filters'}
            </p>
            <button
              onClick={handleReset}
              className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2"
            >
              {showFavoritesOnly ? 'Show all users' : 'Clear all filters'}
            </button>
          </div>
        )}

        {/* Card grid — current page only */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {pagination.pageItems.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  searchTerm={filters.search}
                  isFavorite={isFavorite(user.id)}
                  onToggleFavorite={toggleFav}
                />
              ))}
            </div>

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              prev={pagination.prev}
              next={pagination.next}
              hasPrev={pagination.hasPrev}
              hasNext={pagination.hasNext}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={filtered.length}
            />
          </>
        )}
      </main>
    </div>
  );
}
