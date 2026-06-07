import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';
import Avatar from './Avatar';
import IconText from './IconText';

interface Props {
  user: User;
  searchTerm?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

function highlight(text: string, term: string): React.ReactNode {
  if (!term.trim()) return text;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-amber-200 text-amber-900 rounded px-0.5 dark:bg-amber-700 dark:text-amber-100"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

const UserCard = memo(function UserCard({
  user,
  searchTerm = '',
  isFavorite = false,
  onToggleFavorite,
}: Props) {
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
            ${isFavorite
              ? 'text-amber-400'
              : 'text-slate-200 hover:text-amber-300 dark:text-slate-600 dark:hover:text-amber-400'
            }`}
        >
          ★
        </button>
      )}

      {/* Avatar + name */}
      <div className="flex items-center gap-3 pr-6">
        <Avatar
          name={user.name}
          id={user.id}
          size="sm"
          className="transition-transform duration-200 group-hover:scale-105"
        />
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
        <IconText icon="✉">{highlight(user.email, searchTerm)}</IconText>
        <IconText icon="📍">{user.address.city}</IconText>
        <IconText icon="🏢">{user.company.name}</IconText>
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
