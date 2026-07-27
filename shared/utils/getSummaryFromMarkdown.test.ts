import { describe, expect, it } from 'vitest';

import { getSummaryFromMarkdown } from './getSummaryFromMarkdown';

describe('getSummaryFromMarkdown', () => {
  it('removes markdown elements', () => {
    const simpleHeading = `**A** B

    * C

    > D

    E
    `;

    expect(getSummaryFromMarkdown(simpleHeading)).toEqual('A  B C D E');
  });

  it('creates consistent length summaries', () => {
    const shortContent = '# Short Title';
    const summary1 = getSummaryFromMarkdown(shortContent);
    expect(summary1).toEqual('Short Title');

    const longContent =
      "Hey Pro's, Some updates to share this month! **Bazar speed upgrade** This one has been a long time coming. Loading times on the Bazar were getting embarrassing, up to 40 seconds in some cases.";
    const summary2 = getSummaryFromMarkdown(longContent);
    expect(summary2?.length).toBeLessThanOrEqual(164); // 160 + "..."
    expect(summary2).toContain("Hey Pro's");
  });

  it('handles lists properly', () => {
    const listContent = `
    * First item
    * Second item
    * Third item
    `;
    const summary = getSummaryFromMarkdown(listContent);
    expect(summary).toContain('First item');
  });

  it('truncates at word boundaries', () => {
    const longText =
      'This is a very long paragraph that goes on and on with many words that should be truncated at a reasonable word boundary rather than cutting off in the middle of a word which would look unprofessional and confusing.';
    const summary = getSummaryFromMarkdown(longText);
    expect(summary?.endsWith('...')).toBe(true);
    expect(summary?.length).toBeLessThanOrEqual(164); // 160 + "..."
    // Verify it doesn't cut mid-word (no orphaned characters before ...)
    const beforeEllipsis = summary?.slice(-10, -3); // Get chars before "..."
    expect(beforeEllipsis).not.toContain(' a ');
    expect(beforeEllipsis).not.toContain(' i ');
  });
});
