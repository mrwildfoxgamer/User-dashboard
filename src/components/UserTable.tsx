import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';
import type { FilterState, SortField } from '../utils/filterUsers';

interface Props {
  users: User[];
  searchTerm?: string;
  sortField: FilterState['sortField'];
  sortOrder: FilterState['sortOrder'];
  onSort: (field: SortField) => void;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
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
    ),
  );
}

const SortIcon = ({
  field,
  active,
  order,
}: {
  field: SortField;
  active: boolean;
  order: 'asc' | 'desc';
}) => (
  <span
    className={`ml-1 inline-block transition-colors ${active ? 'text-slate-800 dark:text-slate-100' : 'text-slate-300 dark:text-slate-600'}`}
  >
    {active ? (order === 'asc' ? '↑' : '↓') : '↕'}
  </span>
);

const SORTABLE_COLS: { key: SortField; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
];

const UserTable = memo(function UserTable({
  users,
  searchTerm = '',
  sortField,
  sortOrder,
  onSort,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const handleFav = useCallback(
    (e: React.MouseEvent, id: number) => {
      e.preventDefault();
      e.stopPropagation();
      onToggleFavorite(id);
    },
    [onToggleFavorite],
  );

  if (users.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 animate-fade-in">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
            {SORTABLE_COLS.map(({ key, label }) => (
              <th
                key={key}
                className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-500 cursor-pointer select-none hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                onClick={() => onSort(key)}
              >
                {label}
                <SortIcon
                  field={key}
                  active={sortField === key}
                  order={sortOrder}
                />
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              City
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Company
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Phone
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 w-10">
              ★
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={user.id}
              className={`group border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors dark:border-slate-700/50 dark:hover:bg-slate-700/30 ${idx % 2 === 0 ? '' : 'bg-slate-50/40 dark:bg-slate-800/60'}`}
            >
              <td className="px-4 py-3">
                <Link
                  to={`/users/${user.id}`}
                  className="font-semibold text-slate-800 hover:text-blue-600 transition-colors dark:text-slate-100 dark:hover:text-blue-400"
                >
                  {highlight(user.name, searchTerm)}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                @{highlight(user.username, searchTerm)}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                <a
                  href={`mailto:${user.email}`}
                  className="hover:text-blue-600 transition-colors dark:hover:text-blue-400"
                >
                  {highlight(user.email, searchTerm)}
                </a>
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {user.address.city}
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {user.company.name}
              </td>
              <td className="px-4 py-3 text-slate-400 dark:text-slate-500 font-mono text-xs">
                {user.phone}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={(e) => handleFav(e, user.id)}
                  aria-label={
                    isFavorite(user.id)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                  className={`text-lg leading-none transition-all duration-150 hover:scale-125 active:scale-95 ${
                    isFavorite(user.id)
                      ? 'text-amber-400'
                      : 'text-slate-200 hover:text-amber-300 dark:text-slate-600 dark:hover:text-amber-400'
                  }`}
                >
                  ★
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default UserTable;
