// ─── Address ────────────────────────────────────────────────────────────────
export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

// ─── Company ─────────────────────────────────────────────────────────────────
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: Address;
  company: Company;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
