import { describe, it, expect } from 'vitest';
import { ensureHttps } from '../utils/url';

describe('ensureHttps', () => {
  it('prepends https:// to bare domains', () => {
    expect(ensureHttps('example.com')).toBe('https://example.com');
  });

  it('leaves https:// URLs unchanged', () => {
    expect(ensureHttps('https://example.com')).toBe('https://example.com');
  });

  it('leaves http:// URLs unchanged', () => {
    expect(ensureHttps('http://example.com')).toBe('http://example.com');
  });

  it('handles subdomains', () => {
    expect(ensureHttps('api.example.com/path')).toBe(
      'https://api.example.com/path',
    );
  });
});
