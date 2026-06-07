import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';

interface Props {
  user: User;
  searchTerm?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

function highlight(text: string, term: string): React.ReactNode {
  if (!term.trim()) return text;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5 dark:bg-amber-700 dark:text-amber-100">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

const COLOURS = [
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
];

const UserCard = memo(function UserCard({
  user,
  searchTerm = '',
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const colourClass = COLOURS[user.id % COLOURS.length];

  const handleFav = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleFavorite?.(user.id);
    },
    [user.id, onToggleFavorite]
  );

  return (
    <Link
      to={`/users/${user.id}`}
      className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm
                 transition-all duration-200 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1
                 animate-slide-up
                 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:shadow-slate-900/50"
    >
      {/* Favorite button */}
      {onToggleFavorite && (
        <button
          onClick={handleFav}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute right-4 top-4 text-lg leading-none transition-all duration-150 hover:scale-125 active:scale-95
            ${isFavorite ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300 dark:text-slate-600 dark:hover:text-amber-400'}`}
        >
          ★
        </button>
      )}

      {/* Avatar + name */}
      <div className="flex items-center gap-3 pr-6">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform duration-200 group-hover:scale-105 ${colourClass}`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-800 leading-tight dark:text-slate-100">
            {highlight(user.name, searchTerm)}
          </p>
          <p className="truncate text-sm text-slate-400 dark:text-slate-500">
            @{highlight(user.username, searchTerm)}
          </p>
        </div>
      </div>

      {/* Details */}
      <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
        <li className="flex items-center gap-2 truncate">
          <span className="text-slate-400 dark:text-slate-500">✉</span>
          <span className="truncate">{highlight(user.email, searchTerm)}</span>
        </li>
        <li className="flex items-center gap-2 truncate">
          <span className="text-slate-400 dark:text-slate-500">📍</span>
          <span className="truncate">{user.address.city}</span>
        </li>
        <li className="flex items-center gap-2 truncate">
          <span className="text-slate-400 dark:text-slate-500">🏢</span>
          <span className="truncate">{user.company.name}</span>
        </li>
      </ul>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
        <span>{user.phone}</span>
        <span className="text-slate-300 group-hover:text-slate-500 transition-colors dark:text-slate-600 dark:group-hover:text-slate-400">
          View →
        </span>
      </div>
    </Link>
  );
});

export default UserCard;
