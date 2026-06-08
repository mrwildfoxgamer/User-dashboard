import { useCallback } from 'react';
import { useUsers } from '../hooks/useUsers';
import { usePagination } from '../hooks/usePagination';
import { useUserFilters } from '../hooks/useUserFilters';
import { useViewMode } from '../hooks/useViewMode';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import UserCard from '../components/UserCard';
import UserTable from '../components/UserTable';
import Toolbar from '../components/Toolbar';
import SkeletonGrid from '../components/SkeletonGrid';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { exportUsersToCsv } from '../utils/exportCsv';
import type { SortField } from '../utils/filterUsers';

export default function Home() {
  const { data: users, loading, error, retry } = useUsers();
  const { favorites, toggle: toggleFav, isFavorite } = useFavorites();
  const { isDark, toggle: toggleTheme } = useTheme();
  const { viewMode, setMode } = useViewMode();

  const {
    filters,
    showFavoritesOnly,
    filtered,
    cities,
    companies,
    patchFilters,
    reset,
    toggleFavoritesOnly,
  } = useUserFilters(users, favorites);

  const pagination = usePagination(filtered);

  const handleExportCsv = useCallback(() => {
    exportUsersToCsv(filtered, 'users-export.csv');
  }, [filtered]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (filters.sortField === field) {
        patchFilters({
          sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
        });
      } else {
        patchFilters({ sortField: field, sortOrder: 'asc' });
      }
    },
    [filters.sortField, filters.sortOrder, patchFilters],
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Header
        favoritesCount={favorites.size}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Toolbar — only when data is ready */}
        {!loading && !error && (
          <Toolbar
            filters={filters}
            cities={cities}
            companies={companies}
            totalCount={users?.length ?? 0}
            filteredCount={filtered.length}
            favoritesCount={favorites.size}
            showFavoritesOnly={showFavoritesOnly}
            viewMode={viewMode}
            onChange={patchFilters}
            onReset={reset}
            onToggleFavoritesFilter={toggleFavoritesOnly}
            onExportCsv={handleExportCsv}
            onViewModeChange={setMode}
          />
        )}

        {loading && <SkeletonGrid />}
        {error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState showFavoritesOnly={showFavoritesOnly} onReset={reset} />
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            {/* Card view */}
            {viewMode === 'card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
            )}

            {/* Table view */}
            {viewMode === 'table' && (
              <UserTable
                users={pagination.pageItems}
                searchTerm={filters.search}
                sortField={filters.sortField}
                sortOrder={filters.sortOrder}
                onSort={handleSort}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFav}
              />
            )}

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
