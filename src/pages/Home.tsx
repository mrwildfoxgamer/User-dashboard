import { useState, useMemo, useCallback } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useFavorites } from '../hooks/useFavorites';
import { usePagination } from '../hooks/usePagination';
import { useTheme } from '../hooks/useTheme';
import UserCard from '../components/UserCard';
import Toolbar from '../components/Toolbar';
import SkeletonGrid from '../components/SkeletonGrid';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { filterAndSort, getUnique, DEFAULT_FILTERS } from '../utils/filterUsers';
import { exportUsersToCsv } from '../utils/exportCsv';
import type { FilterState } from '../utils/filterUsers';

export default function Home() {
  const { data: users, loading, error, retry } = useUsers();
  const { favorites, toggle: toggleFav, isFavorite } = useFavorites();
  const { isDark, toggle: toggleTheme } = useTheme();
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

  const handleExportCsv = useCallback(() => {
    exportUsersToCsv(filtered, 'users-export.csv');
  }, [filtered]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Header
        favoritesCount={favorites.size}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 space-y-6">
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
            onExportCsv={handleExportCsv}
          />
        )}

        {/* Loading */}
        {loading && <SkeletonGrid />}

        {/* Error */}
        {error && <ErrorState message={error} onRetry={retry} />}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState showFavoritesOnly={showFavoritesOnly} onReset={handleReset} />
        )}

        {/* Card grid */}
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

      <Footer />
    </div>
  );
}
