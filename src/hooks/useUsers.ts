import { useState, useEffect } from 'react';
import type { ApiResponse, User } from '../types';
import { UserService } from '../services/userService';

export function useUsers(): ApiResponse<User[]> {
  const [state, setState] = useState<ApiResponse<User[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    UserService.getAll()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: Error) =>
        setState({ data: null, loading: false, error: err.message })
      );
  }, []);

  return state;
}

export function useUser(id: number): ApiResponse<User> {
  const [state, setState] = useState<ApiResponse<User>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    UserService.getById(id)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: Error) =>
        setState({ data: null, loading: false, error: err.message })
      );
  }, [id]);

  return state;
}
