import { render } from 'react-email';
import { describe, expect, it } from 'vitest';

import { renderTiptapEmail } from './renderTiptapEmail';

const html = (content: object[]) => render(<>{renderTiptapEmail({ type: 'doc', content })}</>);

describe('renderTiptapEmail', () => {
  it('drops links that are not http, https or mailto', async () => {
    const output = await html([
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'bad', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] },
          { type: 'text', text: 'good', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] },
        ],
      },
    ]);

    expect(output).not.toContain('javascript:');
    expect(output).toContain('href="https://example.com"');
  });

  it('drops images without an http or https source', async () => {
    const output = await html([
      { type: 'image', attrs: { src: 'javascript:alert(1)' } },
      { type: 'image', attrs: { src: 'https://example.com/a.png' } },
    ]);

    expect(output).not.toContain('javascript:');
    expect(output).toContain('src="https://example.com/a.png"');
  });
});
