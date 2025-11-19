import { describe, expect, it } from 'vitest';

import { getFrameSrc } from './Academy';

describe('getFrameSrc', () => {
  const basePath = `https://example.com/`;

  it.each([
    ['/', 'https://example.com/'],
    ['/academy/', 'https://example.com/'],
    ['/academy/path', 'https://example.com/path'],
  ])('formats a URL correctly', (path, expected) => {
    expect(getFrameSrc(basePath, path)).toBe(expected);
  });
});
