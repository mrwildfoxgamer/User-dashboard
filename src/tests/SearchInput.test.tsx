import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Toolbar from '../components/Toolbar';
import type { FilterState } from '../utils/filterUsers';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  sortField: 'name',
  sortOrder: 'asc',
  city: '',
  company: '',
};

const renderToolbar = (onChange = vi.fn(), overrides: Partial<FilterState> = {}) =>
  render(
    <MemoryRouter>
      <Toolbar
        filters={{ ...DEFAULT_FILTERS, ...overrides }}
        cities={['New York', 'Chicago']}
        companies={['Acme', 'Globex']}
        totalCount={10}
        filteredCount={10}
        favoritesCount={0}
        showFavoritesOnly={false}
        onChange={onChange}
        onReset={vi.fn()}
        onToggleFavoritesFilter={vi.fn()}
        onExportCsv={vi.fn()}
      />
    </MemoryRouter>
  );

describe('Search Input (via Toolbar)', () => {
  it('renders search input with placeholder', () => {
    renderToolbar();
    expect(screen.getByPlaceholderText(/search name/i)).toBeInTheDocument();
  });

  it('shows clear button when input has value', () => {
    renderToolbar(vi.fn(), { search: 'alice' });
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('hides clear button when input is empty', () => {
    renderToolbar();
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('calls onChange with search after debounce', async () => {
    const onChange = vi.fn();
    renderToolbar(onChange);
    const input = screen.getByPlaceholderText(/search name/i);
    fireEvent.change(input, { target: { value: 'bob' } });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith({ search: 'bob' }), { timeout: 500 });
  });

  it('clears input when clear button is clicked', async () => {
    const onChange = vi.fn();
    renderToolbar(onChange, { search: 'alice' });
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(onChange).toHaveBeenCalledWith({ search: '' });
  });

  it('renders city and company dropdowns', () => {
    renderToolbar();
    expect(screen.getByDisplayValue('All cities')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All companies')).toBeInTheDocument();
  });

  it('calls onChange when city filter changes', () => {
    const onChange = vi.fn();
    renderToolbar(onChange);
    fireEvent.change(screen.getByDisplayValue('All cities'), { target: { value: 'New York' } });
    expect(onChange).toHaveBeenCalledWith({ city: 'New York' });
  });
});
