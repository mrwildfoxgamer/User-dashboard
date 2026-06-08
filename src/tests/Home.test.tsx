import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { ThemeProvider } from '../context/ThemeContext';
import { FavoritesProvider } from '../context/FavoritesContext';

vi.mock('../services/userService', () => ({
  UserService: {
    getAll: vi.fn(),
    getById: vi.fn(),
  },
}));

import { UserService } from '../services/userService';

const mockUsers = [
  {
    id: 1,
    name: 'Alice Smith',
    username: 'alice',
    email: 'alice@test.com',
    phone: '555-0001',
    website: 'alice.dev',
    address: {
      street: '1 St',
      suite: '',
      city: 'New York',
      zipcode: '10001',
      geo: { lat: '0', lng: '0' },
    },
    company: { name: 'Acme', catchPhrase: '', bs: '' },
  },
  {
    id: 2,
    name: 'Bob Jones',
    username: 'bob',
    email: 'bob@test.com',
    phone: '555-0002',
    website: 'bob.dev',
    address: {
      street: '2 St',
      suite: '',
      city: 'Chicago',
      zipcode: '60601',
      geo: { lat: '0', lng: '0' },
    },
    company: { name: 'Globex', catchPhrase: '', bs: '' },
  },
];

const renderHome = () =>
  render(
    <ThemeProvider>
      <FavoritesProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </FavoritesProvider>
    </ThemeProvider>,
  );

describe('Home page', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('shows loading skeleton initially', () => {
    vi.mocked(UserService.getAll).mockReturnValue(new Promise(() => {}));
    renderHome();
    expect(document.querySelector('.animate-skeleton')).toBeTruthy();
  });

  it('renders user cards after successful fetch', async () => {
    vi.mocked(UserService.getAll).mockResolvedValue(mockUsers as never);
    renderHome();
    await waitFor(() =>
      expect(screen.getByText('Alice Smith')).toBeInTheDocument(),
    );
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('shows error state on API failure', async () => {
    vi.mocked(UserService.getAll).mockRejectedValue(
      new Error('Failed to fetch'),
    );
    renderHome();
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders header with title', () => {
    vi.mocked(UserService.getAll).mockReturnValue(new Promise(() => {}));
    renderHome();
    expect(screen.getByText('User Directory')).toBeInTheDocument();
  });

  it('filters users by search', async () => {
    vi.mocked(UserService.getAll).mockResolvedValue(mockUsers as never);
    renderHome();
    await waitFor(() => screen.getByText('Alice Smith'));

    const input = screen.getByPlaceholderText(/search name/i);
    fireEvent.change(input, { target: { value: 'alice' } });

    await waitFor(
      () =>
        expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument(),
      { timeout: 600 },
    );
    expect(screen.getAllByText(/alice/i).length).toBeGreaterThan(0);
  });

  it('shows empty state when no results match', async () => {
    vi.mocked(UserService.getAll).mockResolvedValue(mockUsers as never);
    renderHome();
    await waitFor(() => screen.getByText('Alice Smith'));

    const input = screen.getByPlaceholderText(/search name/i);
    fireEvent.change(input, { target: { value: 'zzzzz' } });

    await waitFor(
      () =>
        expect(
          screen.getByText(/no users match/i),
        ).toBeInTheDocument(),
      { timeout: 600 },
    );
  });

  it('switches to table view when table button is clicked', async () => {
    vi.mocked(UserService.getAll).mockResolvedValue(mockUsers as never);
    renderHome();
    await waitFor(() => screen.getByText('Alice Smith'));

    const tableBtn = screen.getByLabelText('Table view');
    fireEvent.click(tableBtn);

    // Table should now be in the DOM
    expect(document.querySelector('table')).toBeInTheDocument();
  });
});
