import { memo } from 'react';

/** Deterministic colour palette — cycles by user id */
const PALETTE = [
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
] as const;

export function getAvatarColour(id: number): string {
  return PALETTE[id % PALETTE.length] ?? PALETTE[0];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface Props {
  name: string;
  id: number;
  size?: 'sm' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-11 w-11 text-sm font-bold',
  lg: 'h-20 w-20 text-2xl font-bold',
};

const Avatar = memo(function Avatar({ name, id, size = 'sm', className = '' }: Props) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full ${SIZE_MAP[size]} ${getAvatarColour(id)} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
});

export default Avatar;
