const BASE_URL = 'https://jsonplaceholder.typicode.com';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new ApiError(res.status, `HTTP ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}
