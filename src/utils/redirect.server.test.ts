import { describe, expect, it } from 'vitest';
import { getReturnUrl } from './redirect.server';

const requestWith = (returnUrl: string) =>
  new Request(`https://example.com/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`);

describe('getReturnUrl', () => {
  it('returns the fallback when returnUrl is missing', () => {
    expect(getReturnUrl(new Request('https://example.com/sign-in'), '/home')).toBe('/home');
  });

  it('returns same-origin paths', () => {
    expect(getReturnUrl(requestWith('/questions/a-question?x=1'))).toBe('/questions/a-question?x=1');
  });

  it.each([
    '//evil.tld',
    '/\\evil.tld',
    '/\t/evil.tld',
    'https://evil.tld',
    'javascript:alert(1)',
    'evil.tld',
  ])('rejects %s', (returnUrl) => {
    expect(getReturnUrl(requestWith(returnUrl), '/home')).toBe('/home');
  });
});
