import { describe, expect, it } from 'vitest';
import { renderNewsBodyHtml } from './renderNewsBodyHtml';

describe('renderNewsBodyHtml', () => {
  it('preserves centered text alignment from content JSON', () => {
    const html = renderNewsBodyHtml({
      body: '',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: { textAlign: 'center' },
            content: [{ type: 'text', text: 'Hello' }],
          },
        ],
      },
    });

    expect(html).toContain('text-align');
    expect(html).toContain('center');
  });

  it('centers an image via margin/display, not text-align', () => {
    const html = renderNewsBodyHtml({
      body: '',
      content: {
        type: 'doc',
        content: [
          {
            type: 'image',
            attrs: { src: 'https://example.com/a.png', textAlign: 'center' },
          },
        ],
      },
    });

    expect(html).toContain('display: block');
    expect(html).toContain('margin: 0px auto');
  });

  it('falls back to marked(body) when content is absent', () => {
    const html = renderNewsBodyHtml({ body: '**bold**', content: null });
    expect(html).toContain('<strong>bold</strong>');
  });
});
