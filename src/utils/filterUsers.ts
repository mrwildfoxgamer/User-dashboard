import type { User } from '../types';

export type SortField = 'name' | 'username' | 'email';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  search: string;
  sortField: SortField;
  sortOrder: SortOrder;
  city: string;
  company: string;
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  sortField: 'name',
  sortOrder: 'asc',
  city: '',
  company: '',
};

export function filterAndSort(users: User[], filters: FilterState): User[] {
  const q = filters.search.toLowerCase().trim();

  let result = users.filter((u) => {
    // Search: name, username, email (case-insensitive)
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);

    // City filter
    const matchesCity = !filters.city || u.address.city === filters.city;

    // Company filter
    const matchesCompany = !filters.company || u.company.name === filters.company;

    return matchesSearch && matchesCity && matchesCompany;
  });

  // Sort
  result = [...result].sort((a, b) => {
    const aVal = a[filters.sortField].toLowerCase();
    const bVal = b[filters.sortField].toLowerCase();
    const cmp = aVal.localeCompare(bVal);
    return filters.sortOrder === 'asc' ? cmp : -cmp;
  });

  return result;
}

export function getUnique(users: User[], field: 'city' | 'company'): string[] {
  const vals = users.map((u) =>
    field === 'city' ? u.address.city : u.company.name
  );
  return Array.from(new Set(vals)).sort();
}
