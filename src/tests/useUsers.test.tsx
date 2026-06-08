import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '../hooks/useUsers';

// Mock the entire userService so we control what the hook receives
vi.mock('../services/userService', () => ({
  UserService: {
    getAll: vi.fn(),
    getById: vi.fn(),
  },
}));

import { UserService } from '../services/userService';

const mockUsers = [
  { id: 1, name: 'Alice', username: 'alice', email: 'alice@test.com' },
];

describe('useUsers', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('starts in loading state', () => {
    vi.mocked(UserService.getAll).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useUsers());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns data on successful fetch', async () => {
    vi.mocked(UserService.getAll).mockResolvedValue(mockUsers as never);
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(mockUsers);
    expect(result.current.error).toBeNull();
  });

  it('returns error message on failure', async () => {
    vi.mocked(UserService.getAll).mockRejectedValue(
      new Error('HTTP 500: Internal Server Error'),
    );
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toContain('500');
  });

  it('returns error on network failure', async () => {
    vi.mocked(UserService.getAll).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
  });

  it('exposes a retry function', () => {
    vi.mocked(UserService.getAll).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useUsers());
    expect(typeof result.current.retry).toBe('function');
  });
});
