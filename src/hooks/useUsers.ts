import { useState, useEffect, useCallback } from 'react';
import type { ApiResponse, User } from '../types';
import { UserService } from '../services/userService';

// ─── useUsers (list, with retry) ──────────────────────────────────────────────
export function useUsers(): ApiResponse<User[]> & { retry: () => void } {
  const [state, setState] = useState<ApiResponse<User[]>>({
    data: null,
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    UserService.getAll()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const retry = useCallback(() => setTick((t) => t + 1), []);

  return { ...state, retry };
}

// ─── useUser (single, with retry) ─────────────────────────────────────────────
export function useUser(id: number): ApiResponse<User> & { retry: () => void } {
  const [state, setState] = useState<ApiResponse<User>>({
    data: null,
    loading: true,
    error: null,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    UserService.getById(id)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [id, tick]);

  const retry = useCallback(() => setTick((t) => t + 1), []);

  return { ...state, retry };
}
