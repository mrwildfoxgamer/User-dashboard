import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';

const mockUsers = [
  {
    id: 1, name: 'Alice Smith', username: 'alice', email: 'alice@test.com',
    phone: '555-0001', website: 'alice.dev',
    address: { street: '1 St', suite: '', city: 'New York', zipcode: '10001', geo: { lat: '0', lng: '0' } },
    company: { name: 'Acme', catchPhrase: '', bs: '' },
  },
  {
    id: 2, name: 'Bob Jones', username: 'bob', email: 'bob@test.com',
    phone: '555-0002', website: 'bob.dev',
    address: { street: '2 St', suite: '', city: 'Chicago', zipcode: '60601', geo: { lat: '0', lng: '0' } },
    company: { name: 'Globex', catchPhrase: '', bs: '' },
  },
];

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe('Home page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    // Mock localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows loading skeleton initially', () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));
    renderHome();
    // Skeleton renders divs with animate-skeleton class
    expect(document.querySelector('.animate-skeleton')).toBeTruthy();
  });

  it('renders user cards after successful fetch', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    } as Response);

    renderHome();

    await waitFor(() => expect(screen.getByText('Alice Smith')).toBeInTheDocument());
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('shows error state on API failure', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Failed to fetch'));

    renderHome();

    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders header with title', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => mockUsers } as Response);
    renderHome();
    expect(screen.getByText('User Directory')).toBeInTheDocument();
  });

  it('filters users by search', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => mockUsers } as Response);
    renderHome();

    await waitFor(() => screen.getByText('Alice Smith'));

    const input = screen.getByPlaceholderText(/search name/i);
    fireEvent.change(input, { target: { value: 'alice' } });

    await waitFor(() => expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument(), { timeout: 600 });
    // highlight() splits text across elements, so use getAllByText with regex
    expect(screen.getAllByText(/alice/i).length).toBeGreaterThan(0);
  });

  it('shows empty state when no results match', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => mockUsers } as Response);
    renderHome();

    await waitFor(() => screen.getByText('Alice Smith'));

    const input = screen.getByPlaceholderText(/search name/i);
    fireEvent.change(input, { target: { value: 'zzzzz' } });

    await waitFor(() => expect(screen.getByText(/no users match/i)).toBeInTheDocument(), { timeout: 600 });
  });
});
