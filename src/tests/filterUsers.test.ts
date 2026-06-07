import { describe, it, expect } from 'vitest';
import { filterAndSort, getUnique, DEFAULT_FILTERS } from '../utils/filterUsers';
import type { User } from '../types';

const makeUser = (overrides: Partial<User> & { id: number; name: string }): User => ({
  id: overrides.id,
  name: overrides.name,
  username: overrides.username ?? overrides.name.toLowerCase(),
  email: overrides.email ?? `${overrides.name.toLowerCase()}@test.com`,
  phone: '555-0000',
  website: 'test.dev',
  address: {
    street: '1 St',
    suite: '',
    city: overrides.address?.city ?? 'CityA',
    zipcode: '00000',
    geo: { lat: '0', lng: '0' },
  },
  company: {
    name: overrides.company?.name ?? 'CompanyA',
    catchPhrase: '',
    bs: '',
  },
});

const alice = makeUser({ id: 1, name: 'Alice', address: { city: 'New York' } as any, company: { name: 'Acme' } as any });
const bob   = makeUser({ id: 2, name: 'Bob',   address: { city: 'Chicago' } as any, company: { name: 'Globex' } as any });
const carol = makeUser({ id: 3, name: 'Carol', address: { city: 'New York' } as any, company: { name: 'Acme' } as any, email: 'carol@example.com' });

const users = [alice, bob, carol];

describe('filterAndSort', () => {
  it('returns all users with default filters', () => {
    expect(filterAndSort(users, DEFAULT_FILTERS)).toHaveLength(3);
  });

  it('filters by search term (name)', () => {
    const result = filterAndSort(users, { ...DEFAULT_FILTERS, search: 'alice' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });

  it('filters by search term (email)', () => {
    const result = filterAndSort(users, { ...DEFAULT_FILTERS, search: 'carol@example' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Carol');
  });

  it('filters by city', () => {
    const result = filterAndSort(users, { ...DEFAULT_FILTERS, city: 'New York' });
    expect(result).toHaveLength(2);
  });

  it('filters by company', () => {
    const result = filterAndSort(users, { ...DEFAULT_FILTERS, company: 'Acme' });
    expect(result).toHaveLength(2);
  });

  it('combines search and city filters', () => {
    const result = filterAndSort(users, { ...DEFAULT_FILTERS, search: 'carol', city: 'New York' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Carol');
  });

  it('sorts ascending by name', () => {
    const result = filterAndSort(users, { ...DEFAULT_FILTERS, sortField: 'name', sortOrder: 'asc' });
    expect(result.map((u) => u.name)).toEqual(['Alice', 'Bob', 'Carol']);
  });

  it('sorts descending by name', () => {
    const result = filterAndSort(users, { ...DEFAULT_FILTERS, sortField: 'name', sortOrder: 'desc' });
    expect(result.map((u) => u.name)).toEqual(['Carol', 'Bob', 'Alice']);
  });

  it('returns empty array when nothing matches', () => {
    const result = filterAndSort(users, { ...DEFAULT_FILTERS, search: 'zzz' });
    expect(result).toHaveLength(0);
  });
});

describe('getUnique', () => {
  it('returns unique cities sorted', () => {
    expect(getUnique(users, 'city')).toEqual(['Chicago', 'New York']);
  });

  it('returns unique companies sorted', () => {
    expect(getUnique(users, 'company')).toEqual(['Acme', 'Globex']);
  });
});
