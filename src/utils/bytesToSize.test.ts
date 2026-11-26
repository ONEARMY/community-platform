import { bytesToSize } from 'oa-shared';
import { describe, expect, it } from 'vitest';

describe('bytesToSize', () => {
  it('returns 0 Bytes for an empty file', () => {
    expect(bytesToSize(0)).toBe('0 Bytes');
  });

  it('formats each unit', () => {
    expect(bytesToSize(500)).toBe('500 Bytes');
    expect(bytesToSize(1024)).toBe('1.00 KB');
    expect(bytesToSize(5 * 1024 * 1024)).toBe('5.00 MB');
    expect(bytesToSize(3 * 1024 ** 3)).toBe('3.00 GB');
  });

  it('moves to the next unit instead of using exponent notation near a boundary', () => {
    expect(bytesToSize(1023)).toBe('0.999 KB');
    expect(bytesToSize(1024 * 1024 - 1)).toBe('1.00 MB');
  });
});
