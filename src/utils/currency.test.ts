import { describe, expect, it } from 'vitest';
import { currencySymbol, formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('drops the decimals on whole amounts', () => {
    expect(formatCurrency(1000, 'EUR', 'en-GB')).toBe('€10');
  });

  it('keeps the decimals otherwise', () => {
    expect(formatCurrency(1041, 'EUR', 'en-GB')).toBe('€10.41');
  });

  it('accepts a lowercase currency code, as Stripe sends them', () => {
    expect(formatCurrency(1000, 'eur', 'en-GB')).toBe(formatCurrency(1000, 'EUR', 'en-GB'));
  });

  it('does not divide by 100 for a currency with no minor unit', () => {
    expect(formatCurrency(1500, 'JPY', 'en-GB')).toContain('1,500');
  });

  it('divides by 1000 for a currency with three decimal places', () => {
    expect(formatCurrency(1500, 'KWD', 'en-GB')).toContain('1.500');
  });

  it('follows the locale it is given', () => {
    expect(formatCurrency(123456, 'EUR', 'de-DE')).toContain('1.234,56');
  });

  it('throws on a currency code Intl does not recognise', () => {
    expect(() => formatCurrency(1000, 'not-a-currency', 'en-GB')).toThrow();
  });
});

describe('currencySymbol', () => {
  it('returns the narrow symbol', () => {
    expect(currencySymbol('EUR', 'en-GB')).toBe('€');
    expect(currencySymbol('GBP', 'en-GB')).toBe('£');
  });
});
