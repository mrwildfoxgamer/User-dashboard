import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/Pagination';

const defaultProps = {
  page: 1,
  totalPages: 3,
  prev: vi.fn(),
  next: vi.fn(),
  hasPrev: false,
  hasNext: true,
  startIndex: 1,
  endIndex: 5,
  totalItems: 15,
};

describe('Pagination', () => {
  it('renders showing range text', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
  });

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('disables prev button on first page', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} page={3} hasPrev={true} hasNext={false} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('calls prev when prev button clicked', () => {
    const prev = vi.fn();
    render(<Pagination {...defaultProps} page={2} hasPrev={true} prev={prev} />);
    fireEvent.click(screen.getByLabelText('Previous page'));
    expect(prev).toHaveBeenCalledOnce();
  });

  it('calls next when next button clicked', () => {
    const next = vi.fn();
    render(<Pagination {...defaultProps} next={next} />);
    fireEvent.click(screen.getByLabelText('Next page'));
    expect(next).toHaveBeenCalledOnce();
  });

  it('marks current page with aria-current', () => {
    render(<Pagination {...defaultProps} page={2} hasPrev={true} />);
    expect(screen.getByLabelText('Go to page 2')).toHaveAttribute('aria-current', 'page');
  });
});
