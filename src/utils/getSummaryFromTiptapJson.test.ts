import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vitest';

import { getSummaryFromTiptapJson } from './getSummaryFromTiptapJson';

const doc = (...content: JSONContent[]): JSONContent => ({ type: 'doc', content });
const paragraph = (text: string): JSONContent => ({
  type: 'paragraph',
  content: [{ type: 'text', text }],
});
const heading = (text: string): JSONContent => ({
  type: 'heading',
  attrs: { level: 2 },
  content: [{ type: 'text', text }],
});
const bulletList = (...items: string[]): JSONContent => ({
  type: 'bulletList',
  content: items.map((text) => ({
    type: 'listItem',
    content: [paragraph(text)],
  })),
});

describe('getSummaryFromTiptapJson', () => {
  it('returns null for empty content', () => {
    expect(getSummaryFromTiptapJson(doc())).toBeNull();
    expect(getSummaryFromTiptapJson(null)).toBeNull();
  });

  it('extracts text across paragraphs and headings', () => {
    const result = getSummaryFromTiptapJson(doc(heading('A'), paragraph('B'), paragraph('C')));
    expect(result).toEqual('A B C');
  });

  it('creates consistent length summaries', () => {
    const shortContent = doc(heading('Short Title'));
    expect(getSummaryFromTiptapJson(shortContent)).toEqual('Short Title');

    const longContent = doc(
      paragraph(
        "Hey Pro's, Some updates to share this month! Bazar speed upgrade This one has been a long time coming. Loading times on the Bazar were getting embarrassing, up to 40 seconds in some cases.",
      ),
    );
    const summary = getSummaryFromTiptapJson(longContent);
    expect(summary?.length).toBeLessThanOrEqual(164); // 160 + "..."
    expect(summary).toContain("Hey Pro's");
  });

  it('handles lists properly', () => {
    const listContent = doc(bulletList('First item', 'Second item', 'Third item'));
    const summary = getSummaryFromTiptapJson(listContent);
    expect(summary).toContain('First item');
  });

  it('truncates at word boundaries', () => {
    const longText = doc(
      paragraph(
        'This is a very long paragraph that goes on and on with many words that should be truncated at a reasonable word boundary rather than cutting off in the middle of a word which would look unprofessional and confusing.',
      ),
    );
    const summary = getSummaryFromTiptapJson(longText);
    expect(summary?.endsWith('...')).toBe(true);
    expect(summary?.length).toBeLessThanOrEqual(164); // 160 + "..."
    const beforeEllipsis = summary?.slice(-10, -3);
    expect(beforeEllipsis).not.toContain(' a ');
    expect(beforeEllipsis).not.toContain(' i ');
  });
});
