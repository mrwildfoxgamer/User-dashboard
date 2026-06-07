import { Link } from 'react-router-dom';
import type { User } from '../types';

interface Props {
  user: User;
  searchTerm?: string;
}

function highlight(text: string, term: string): React.ReactNode {
  if (!term.trim()) return text;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function UserCard({ user, searchTerm = '' }: Props) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Deterministic avatar colour from user id
  const colours = [
    'bg-rose-100 text-rose-700',
    'bg-sky-100 text-sky-700',
    'bg-emerald-100 text-emerald-700',
    'bg-violet-100 text-violet-700',
    'bg-amber-100 text-amber-700',
    'bg-pink-100 text-pink-700',
    'bg-teal-100 text-teal-700',
    'bg-indigo-100 text-indigo-700',
  ];
  const colourClass = colours[user.id % colours.length];

  return (
    <Link
      to={`/users/${user.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm
                 transition-all duration-200 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5"
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colourClass}`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-800 leading-tight">
            {highlight(user.name, searchTerm)}
          </p>
          <p className="truncate text-sm text-slate-400">
            @{highlight(user.username, searchTerm)}
          </p>
        </div>
      </div>

      {/* Details */}
      <ul className="space-y-1.5 text-sm text-slate-600">
        <li className="flex items-center gap-2 truncate">
          <span className="text-slate-400">✉</span>
          <span className="truncate">{highlight(user.email, searchTerm)}</span>
        </li>
        <li className="flex items-center gap-2 truncate">
          <span className="text-slate-400">📍</span>
          <span className="truncate">{user.address.city}</span>
        </li>
        <li className="flex items-center gap-2 truncate">
          <span className="text-slate-400">🏢</span>
          <span className="truncate">{user.company.name}</span>
        </li>
      </ul>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>{user.phone}</span>
        <span className="text-slate-300 group-hover:text-slate-500 transition-colors">View →</span>
      </div>
    </Link>
  );
}
