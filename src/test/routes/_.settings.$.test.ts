import { meta } from 'src/routes/_.settings.$';
import { describe, expect, it } from 'vitest';

const callMeta = (pathname: string) =>
  meta({
    loaderData: { siteName: 'Test Site' },
    location: { pathname },
    matches: [{ meta: [] }],
  } as any) as Record<string, string>[];

describe('settings route meta', () => {
  it.each([
    ['/settings/profile', 'Profile - Settings - Test Site'],
    ['/settings/map', 'Map - Settings - Test Site'],
    ['/settings/notifications', 'Notifications - Settings - Test Site'],
    ['/settings/account', 'Account - Settings - Test Site'],
    ['/settings/account/', 'Account - Settings - Test Site'],
  ])('sets the title for %s', (pathname, expected) => {
    const tags = callMeta(pathname);

    expect(tags.find((tag) => 'title' in tag)?.title).toBe(expected);
    expect(tags.find((tag) => tag.property === 'og:title')?.content).toBe(expected);
    expect(tags.find((tag) => tag.name === 'twitter:title')?.content).toBe(expected);
  });
});
