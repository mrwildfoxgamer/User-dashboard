import { memo } from 'react';

const SkeletonGrid = memo(function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-slate-100 animate-skeleton dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-100 animate-skeleton dark:bg-slate-700" />
              <div className="h-3 w-1/2 rounded bg-slate-100 animate-skeleton dark:bg-slate-700" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-100 animate-skeleton dark:bg-slate-700" />
            <div className="h-3 w-4/5 rounded bg-slate-100 animate-skeleton dark:bg-slate-700" />
            <div className="h-3 w-3/5 rounded bg-slate-100 animate-skeleton dark:bg-slate-700" />
          </div>
          <div className="mt-auto pt-3 border-t border-slate-100 h-4 w-full rounded bg-slate-100 animate-skeleton dark:border-slate-700 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
});

export default SkeletonGrid;
