import { memo } from 'react';

interface Props {
  showFavoritesOnly: boolean;
  onReset: () => void;
}

const EmptyState = memo(function EmptyState({ showFavoritesOnly, onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl dark:bg-slate-800">
        {showFavoritesOnly ? '★' : '🔎'}
      </div>
      <div>
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          {showFavoritesOnly ? 'No favorites saved yet' : 'No users match your filters'}
        </p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          {showFavoritesOnly
            ? 'Star a user card to save them here'
            : 'Try adjusting your search or filter criteria'}
        </p>
      </div>
      <button
        onClick={onReset}
        className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
      >
        {showFavoritesOnly ? 'Show all users' : 'Clear all filters'}
      </button>
    </div>
  );
});

export default EmptyState;
