import { useState, useCallback } from 'react';

export type ViewMode = 'card' | 'table';
const STORAGE_KEY = 'user-directory:view-mode';

function load(): ViewMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'card' || v === 'table') return v;
  } catch {}
  return 'card';
}

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(load);

  const setMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  }, []);

  return { viewMode, setMode };
}
