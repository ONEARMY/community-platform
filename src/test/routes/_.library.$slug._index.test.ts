import { meta } from 'src/routes/_.library.$slug._index';
import { FactoryLibraryItem } from 'src/test/factories/Library';
import { describe, expect, it } from 'vitest';

const callMeta = (loaderData: unknown) =>
  meta({ loaderData, matches: [{ meta: [] }] } as any) as Record<string, string>[];

const findContent = (tags: Record<string, string>[], key: 'name' | 'property', value: string) =>
  tags.find((tag) => tag[key] === value)?.content;

describe('library project route meta', () => {
  it('populates title and description tags', () => {
    const project = FactoryLibraryItem({ title: 'Make a shredder', description: 'How to shred' });
    const tags = callMeta({ project, tenantSettings: { siteName: 'Test Site' } });
    const pageTitle = 'Make a shredder - Library - Test Site';

    expect(tags.find((tag) => 'title' in tag)?.title).toBe(pageTitle);
    expect(findContent(tags, 'name', 'description')).toBe('How to shred');
    expect(findContent(tags, 'property', 'og:title')).toBe(pageTitle);
    expect(findContent(tags, 'property', 'og:description')).toBe('How to shred');
    expect(findContent(tags, 'name', 'twitter:title')).toBe(pageTitle);
    expect(findContent(tags, 'name', 'twitter:description')).toBe('How to shred');
  });

  it('returns no tags when the project is missing', () => {
    expect(callMeta({ project: null })).toEqual([]);
  });
});
