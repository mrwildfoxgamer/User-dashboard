import { memo } from 'react';

interface Props {
  icon: string;
  children: React.ReactNode;
  className?: string;
}

/** Inline icon + text row used in UserCard detail list */
const IconText = memo(function IconText({ icon, children, className = '' }: Props) {
  return (
    <li className={`flex items-center gap-2 truncate ${className}`}>
      <span className="text-slate-400 dark:text-slate-500 shrink-0">{icon}</span>
      <span className="truncate">{children}</span>
    </li>
  );
});

export default IconText;
