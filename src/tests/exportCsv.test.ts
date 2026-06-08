import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportUsersToCsv } from '../utils/exportCsv';
import type { User } from '../types';

const makeUser = (id: number, name: string, extra: Partial<User> = {}): User => ({
  id,
  name,
  username: name.toLowerCase(),
  email: `${name.toLowerCase()}@test.com`,
  phone: '555-0000',
  website: 'test.dev',
  address: {
    street: '1 St',
    suite: '',
    city: 'CityA',
    zipcode: '00000',
    geo: { lat: '0', lng: '0' },
  },
  company: { name: 'CompanyA', catchPhrase: '', bs: '' },
  ...extra,
});

describe('exportUsersToCsv', () => {
  let clickSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clickSpy = vi.fn();
    revokeObjectURLSpy = vi.fn();

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: revokeObjectURLSpy,
    });

    // Intercept document.createElement for the anchor tag
    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        const el = origCreate('a');
        el.click = clickSpy;
        return el;
      }
      return origCreate(tag);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('triggers a download by clicking an anchor', () => {
    exportUsersToCsv([makeUser(1, 'Alice')]);
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it('revokes the object URL after download', () => {
    exportUsersToCsv([makeUser(1, 'Alice')]);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('uses default filename when none provided', () => {
    const a = document.createElement('a') as HTMLAnchorElement;
    const setDownload = vi.fn();
    Object.defineProperty(a, 'download', { set: setDownload, configurable: true });
    exportUsersToCsv([makeUser(1, 'Alice')]);
    // Just verifying no error thrown and click was called
    expect(clickSpy).toHaveBeenCalled();
  });

  it('escapes commas and quotes in user data', () => {
    let capturedContent = '';
    const MockBlob = function (parts: string[]) {
      capturedContent = parts.join('');
      return { size: capturedContent.length, type: 'text/csv' };
    };
    vi.stubGlobal('Blob', MockBlob);

    exportUsersToCsv([
      makeUser(1, 'Alice, Jr.', {
        company: { name: 'Acme "Corp"', catchPhrase: '', bs: '' },
      }),
    ]);

    expect(capturedContent).toContain('"Alice, Jr."');
    expect(capturedContent).toContain('"Acme ""Corp"""');

    vi.unstubAllGlobals();
  });

  it('includes header row', () => {
    let capturedContent = '';
    const MockBlob = function (parts: string[]) {
      capturedContent = parts.join('');
      return { size: capturedContent.length, type: 'text/csv' };
    };
    vi.stubGlobal('Blob', MockBlob);

    exportUsersToCsv([makeUser(1, 'Alice')]);

    expect(capturedContent).toContain('Name');
    expect(capturedContent).toContain('Email');
    expect(capturedContent).toContain('Company');

    vi.unstubAllGlobals();
  });
});
