import { memo } from 'react';

const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 px-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-400 dark:text-slate-500">
        <span>User Directory — data from JSONPlaceholder</span>
        <span>Built with React + Vite + Tailwind CSS</span>
      </div>
    </footer>
  );
});

export default Footer;
