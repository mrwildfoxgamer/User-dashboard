import { memo } from 'react';

interface Props {
  favoritesCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header = memo(function Header({ favoritesCount, isDark, onToggleTheme }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm px-6 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
            User Directory
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 dark:text-slate-500">
            Browse, search, and filter all users
          </p>
        </div>

        <div className="flex items-center gap-3">
          {favoritesCount > 0 && (
            <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400">
              <span>★</span>
              <span>{favoritesCount} saved</span>
            </span>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
});

export default Header;
