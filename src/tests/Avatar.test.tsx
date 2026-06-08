import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar, { getInitials, getAvatarColour } from '../components/Avatar';

describe('getInitials', () => {
  it('returns two uppercase initials for a two-word name', () => {
    expect(getInitials('Jane Doe')).toBe('JD');
  });

  it('returns one initial for a single-word name', () => {
    expect(getInitials('Alice')).toBe('A');
  });

  it('returns only first two initials for longer names', () => {
    expect(getInitials('John Paul Smith')).toBe('JP');
  });

  it('uppercases lowercase names', () => {
    expect(getInitials('bob ross')).toBe('BR');
  });
});

describe('getAvatarColour', () => {
  it('returns a Tailwind class string', () => {
    const colour = getAvatarColour(1);
    expect(typeof colour).toBe('string');
    expect(colour.length).toBeGreaterThan(0);
  });

  it('cycles consistently for the same id', () => {
    expect(getAvatarColour(0)).toBe(getAvatarColour(8));
  });

  it('returns different colours for different ids', () => {
    expect(getAvatarColour(0)).not.toBe(getAvatarColour(1));
  });
});

describe('Avatar component', () => {
  it('renders initials from the name', () => {
    render(<Avatar name="Jane Doe" id={1} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies sm size by default', () => {
    const { container } = render(<Avatar name="Jane Doe" id={1} />);
    expect(container.firstChild).toHaveClass('h-11');
  });

  it('applies lg size when specified', () => {
    const { container } = render(<Avatar name="Jane Doe" id={1} size="lg" />);
    expect(container.firstChild).toHaveClass('h-20');
  });
});
