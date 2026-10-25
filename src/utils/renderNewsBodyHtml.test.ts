import { describe, expect, it } from 'vitest';
import { renderNewsBodyHtml } from './renderNewsBodyHtml';

describe('renderNewsBodyHtml', () => {
  it('preserves centered text alignment from content JSON', () => {
    const html = renderNewsBodyHtml({
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

    expect(html).toContain('display:block');
    expect(html).toContain('margin:10px auto');
  });

  it('drops an unknown textAlign', () => {
    const html = renderNewsBodyHtml({
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: { textAlign: '"><img src=x onerror=alert(1)>' },
            content: [{ type: 'text', text: 'Hello' }],
          },
        ],
      },
    });

    expect(html).toBe('<p>Hello</p>');
  });

  it('falls back to h2 for an invalid heading level', () => {
    const html = renderNewsBodyHtml({
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: '1 onmouseover=alert(1)' },
            content: [{ type: 'text', text: 'Title' }],
          },
        ],
      },
    });

    expect(html).toBe('<h2>Title</h2>');
  });

  it('strips unsafe link and image urls', () => {
    const html = renderNewsBodyHtml({
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'bad',
                marks: [{ type: 'link', attrs: { href: ' JavaScript:alert(1)' } }],
              },
            ],
          },
          { type: 'image', attrs: { src: 'javascript:alert(1)' } },
        ],
      },
    });

    expect(html).not.toContain('javascript');
    expect(html).not.toContain('JavaScript');
  });

  it('keeps http(s), mailto and relative links', () => {
    const hrefs = ['https://a.com', 'http://a.com', 'mailto:a@b.com', '/news/x'];
    const html = renderNewsBodyHtml({
      content: {
        type: 'doc',
        content: hrefs.map((href) => ({
          type: 'paragraph',
          content: [{ type: 'text', text: 'x', marks: [{ type: 'link', attrs: { href } }] }],
        })),
      },
    });

    hrefs.forEach((href) => expect(html).toContain(`href="${href}"`));
  });
});
