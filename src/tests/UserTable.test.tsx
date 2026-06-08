import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserTable from '../components/UserTable';
import type { User } from '../types';

const makeUser = (id: number, name: string, city = 'NYC', company = 'Acme'): User => ({
  id,
  name,
  username: name.toLowerCase().replace(' ', ''),
  email: `${name.toLowerCase().replace(' ', '')}@test.com`,
  phone: `555-000${id}`,
  website: 'test.dev',
  address: {
    street: '1 St',
    suite: '',
    city,
    zipcode: '00000',
    geo: { lat: '0', lng: '0' },
  },
  company: { name: company, catchPhrase: '', bs: '' },
});

const users = [
  makeUser(1, 'Alice Smith', 'New York', 'Acme'),
  makeUser(2, 'Bob Jones', 'Chicago', 'Globex'),
];

const defaultProps = {
  users,
  sortField: 'name' as const,
  sortOrder: 'asc' as const,
  onSort: vi.fn(),
  isFavorite: vi.fn(() => false),
  onToggleFavorite: vi.fn(),
};

const renderTable = (props = {}) =>
  render(
    <MemoryRouter>
      <UserTable {...defaultProps} {...props} />
    </MemoryRouter>,
  );

describe('UserTable', () => {
  it('renders a table element', () => {
    renderTable();
    expect(document.querySelector('table')).toBeInTheDocument();
  });

  it('renders user names as links', () => {
    renderTable();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });

  it('renders city and company columns', () => {
    renderTable();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('calls onSort when a sortable header is clicked', () => {
    const onSort = vi.fn();
    renderTable({ onSort });
    fireEvent.click(screen.getByText(/^Name/));
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('calls onToggleFavorite when star is clicked', () => {
    const onToggleFavorite = vi.fn();
    renderTable({ onToggleFavorite });
    const buttons = screen.getAllByRole('button', { name: /add to favorites/i });
    fireEvent.click(buttons[0]!);
    expect(onToggleFavorite).toHaveBeenCalledWith(1);
  });

  it('shows filled star for favorited user', () => {
    renderTable({ isFavorite: (id: number) => id === 1 });
    expect(
      screen.getByRole('button', { name: /remove from favorites/i }),
    ).toBeInTheDocument();
  });

  it('returns null when users array is empty', () => {
    const { container } = renderTable({ users: [] });
    expect(container.firstChild).toBeNull();
  });

  it('highlights search term in name', () => {
    renderTable({ searchTerm: 'Alice' });
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
