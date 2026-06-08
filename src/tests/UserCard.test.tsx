import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserCard from '../components/UserCard';
import type { User } from '../types';

const mockUser: User = {
  id: 1,
  name: 'Jane Doe',
  username: 'janedoe',
  email: 'jane@example.com',
  phone: '555-0100',
  website: 'jane.dev',
  address: {
    street: '123 Main St',
    suite: 'Apt 1',
    city: 'Metropolis',
    zipcode: '12345',
    geo: { lat: '0', lng: '0' },
  },
  company: { name: 'Acme Corp', catchPhrase: 'Just do it', bs: 'synergy' },
};

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <UserCard user={mockUser} {...props} />
    </MemoryRouter>,
  );

describe('UserCard', () => {
  it('renders user name and username', () => {
    renderCard();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('@janedoe')).toBeInTheDocument();
  });

  it('renders email, city, and company', () => {
    renderCard();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Metropolis')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('links to user detail page', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/users/1');
  });

  it('shows favorite button when onToggleFavorite is provided', () => {
    renderCard({ onToggleFavorite: vi.fn() });
    expect(
      screen.getByRole('button', { name: /add to favorites/i }),
    ).toBeInTheDocument();
  });

  it('shows remove label when isFavorite=true', () => {
    renderCard({ onToggleFavorite: vi.fn(), isFavorite: true });
    expect(
      screen.getByRole('button', { name: /remove from favorites/i }),
    ).toBeInTheDocument();
  });

  it('calls onToggleFavorite with user id on star click', () => {
    const onToggleFavorite = vi.fn();
    renderCard({ onToggleFavorite });
    fireEvent.click(screen.getByRole('button', { name: /add to favorites/i }));
    expect(onToggleFavorite).toHaveBeenCalledWith(1);
  });

  it('highlights search term in name', () => {
    renderCard({ searchTerm: 'Jane' });
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('hides favorite button when onToggleFavorite not provided', () => {
    renderCard();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders phone number', () => {
    renderCard();
    expect(screen.getByText('555-0100')).toBeInTheDocument();
  });
});
