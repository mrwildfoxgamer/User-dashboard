import axios from 'axios';

// ─── Axios instance ────────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Typed error wrapper ───────────────────────────────────────────────────────
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ─── Response interceptor — normalise errors ──────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const message =
        error.response?.statusText ?? error.message ?? 'Unknown error';
      return Promise.reject(new ApiError(status, `HTTP ${status}: ${message}`));
    }
    return Promise.reject(error);
  },
);
