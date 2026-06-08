import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDetail from '../pages/UserDetail';
import { ThemeProvider } from '../context/ThemeContext';
import { FavoritesProvider } from '../context/FavoritesContext';

vi.mock('../services/userService', () => ({
  UserService: {
    getAll: vi.fn(),
    getById: vi.fn(),
  },
}));

import { UserService } from '../services/userService';

const mockUser = {
  id: 3,
  name: 'Carol White',
  username: 'carol',
  email: 'carol@example.com',
  phone: '555-0003',
  website: 'carol.io',
  address: {
    street: '3 Maple Ave',
    suite: 'Suite 5',
    city: 'Boston',
    zipcode: '02101',
    geo: { lat: '42.36', lng: '-71.06' },
  },
  company: {
    name: 'TechCorp',
    catchPhrase: 'Innovate daily',
    bs: 'scalable solutions',
  },
};

const renderDetail = (id = '3') =>
  render(
    <ThemeProvider>
      <FavoritesProvider>
        <MemoryRouter initialEntries={[`/users/${id}`]}>
          <Routes>
            <Route path="/users/:id" element={<UserDetail />} />
          </Routes>
        </MemoryRouter>
      </FavoritesProvider>
    </ThemeProvider>,
  );

describe('UserDetail page', () => {
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

  it('shows skeleton while loading', () => {
    vi.mocked(UserService.getById).mockReturnValue(new Promise(() => {}));
    renderDetail();
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders user name and username after fetch', async () => {
    vi.mocked(UserService.getById).mockResolvedValue(mockUser as never);
    renderDetail();
    // Name appears in both the h1 and the breadcrumb — use the heading
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Carol White' })).toBeInTheDocument(),
    );
    expect(screen.getByText('@carol')).toBeInTheDocument();
  });

  it('renders all contact info', async () => {
    vi.mocked(UserService.getById).mockResolvedValue(mockUser as never);
    renderDetail();
    await waitFor(() => screen.getByRole('heading', { name: 'Carol White' }));
    expect(screen.getByText('carol@example.com')).toBeInTheDocument();
    expect(screen.getByText('555-0003')).toBeInTheDocument();
    expect(screen.getByText('carol.io')).toBeInTheDocument();
  });

  it('renders company information', async () => {
    vi.mocked(UserService.getById).mockResolvedValue(mockUser as never);
    renderDetail();
    await waitFor(() => screen.getByRole('heading', { name: 'Carol White' }));
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
    expect(screen.getByText('Innovate daily')).toBeInTheDocument();
    expect(screen.getByText('scalable solutions')).toBeInTheDocument();
  });

  it('renders address information', async () => {
    vi.mocked(UserService.getById).mockResolvedValue(mockUser as never);
    renderDetail();
    await waitFor(() => screen.getByRole('heading', { name: 'Carol White' }));
    expect(screen.getByText('Boston')).toBeInTheDocument();
    expect(screen.getByText('02101')).toBeInTheDocument();
  });

  it('shows error state and retry button on API failure', async () => {
    vi.mocked(UserService.getById).mockRejectedValue(
      new Error('User not found'),
    );
    renderDetail();
    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('toggles favorite when star button is clicked', async () => {
    vi.mocked(UserService.getById).mockResolvedValue(mockUser as never);
    renderDetail();
    await waitFor(() => screen.getByRole('heading', { name: 'Carol White' }));

    const favBtn = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(favBtn);
    expect(
      screen.getByRole('button', { name: /remove from favorites/i }),
    ).toBeInTheDocument();
  });

  it('renders back navigation link', async () => {
    vi.mocked(UserService.getById).mockResolvedValue(mockUser as never);
    renderDetail();
    await waitFor(() => screen.getByRole('heading', { name: 'Carol White' }));
    expect(screen.getByText('← Back')).toBeInTheDocument();
  });
});
