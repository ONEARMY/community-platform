// How many minor units make a major one varies by currency
const currencyExponent = (currency: string): number =>
  new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions()
    .maximumFractionDigits ?? 2;

export const formatCurrency = (minorUnits: number, currency: string, locale: string): string => {
  const exponent = currencyExponent(currency);
  const minorUnitsPerMajor = 10 ** exponent;
  const fractionDigits = minorUnits % minorUnitsPerMajor === 0 ? 0 : exponent;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(minorUnits / minorUnitsPerMajor);
};

export const currencySymbol = (currency: string, locale: string): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  })
    .formatToParts(0)
    .find((part) => part.type === 'currency')?.value || currency.toUpperCase();
