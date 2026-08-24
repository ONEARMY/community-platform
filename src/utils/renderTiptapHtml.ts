import type { JSONContent } from '@tiptap/core';

/**
 * Renders Tiptap JSON to an HTML string directly, without going through any DOM
 * implementation. Tried both `@tiptap/core`'s `generateHTML` (needs a real `window` —
 * ProseMirror's `DOMSerializer` falls back to the global `window.document` when no
 * document is passed in) and `@tiptap/html`'s Node-safe alternative (avoids that, but its
 * `zeed-dom` shim silently drops `style` attributes, breaking text/image alignment).
 * Neither is worth a heavy runtime dependency for — our extension set is small and fixed,
 * so a hand-written walker covering exactly those node/mark types is simpler and fully
 * under our control. Keep this in sync with `src/utils/tiptapExtensions.ts`'s
 * `TIPTAP_EXTENSIONS` if the editor gains new node/mark types.
 */

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeAttr = (text: string): string => escapeHtml(text).replace(/"/g, '&quot;');

/**
 * CSS `text-align` has no visual effect on an `<img>` element itself (it only affects
 * inline content inside a block container) — center/right-align via margin/display
 * instead. Keep in sync with the `Image` extension override in `tiptapExtensions.ts`,
 * which applies the same mapping for the editor's own live (browser) rendering.
 */
const imageAlignStyle = (textAlign: string | undefined): string => {
  if (textAlign === 'center') {
    return 'display:block;margin:0 auto;';
  }
  if (textAlign === 'right') {
    return 'display:block;margin:0 0 0 auto;';
  }
  return '';
};

// Width is only ever set by the editor's own resize presets (see IMAGE_WIDTH_PRESETS in
// tiptapExtensions.ts), but validate the shape anyway before splicing it into a style string.
const imageWidthStyle = (width: unknown): string =>
  typeof width === 'string' && /^\d{1,3}%$/.test(width) ? `width:${width};` : '';

const MARK_TAGS: Record<string, string> = {
  bold: 'strong',
  italic: 'em',
  underline: 'u',
  strike: 's',
  code: 'code',
};

const renderMarksOpen = (marks: JSONContent['marks'] = []): string =>
  marks
    .map((mark) => {
      if (mark.type === 'link') {
        return `<a href="${escapeAttr(mark.attrs?.href ?? '')}" target="_blank" rel="noopener noreferrer">`;
      }
      const tag = MARK_TAGS[mark.type];
      return tag ? `<${tag}>` : '';
    })
    .join('');

const renderMarksClose = (marks: JSONContent['marks'] = []): string =>
  [...marks]
    .reverse()
    .map((mark) => {
      if (mark.type === 'link') {
        return '</a>';
      }
      const tag = MARK_TAGS[mark.type];
      return tag ? `</${tag}>` : '';
    })
    .join('');

const renderInline = (nodes: JSONContent[] = []): string =>
  nodes
    .map((node) => {
      if (node.type === 'text') {
        return `${renderMarksOpen(node.marks)}${escapeHtml(node.text ?? '')}${renderMarksClose(node.marks)}`;
      }
      if (node.type === 'hardBreak') {
        return '<br>';
      }
      return '';
    })
    .join('');

const renderListItem = (node: JSONContent): string =>
  `<li>${(node.content ?? []).map(renderBlock).join('')}</li>`;

const renderBlock = (node: JSONContent): string => {
  const textAlign = node.attrs?.textAlign as string | undefined;
  const alignStyle = textAlign ? ` style="text-align: ${textAlign};"` : '';

  switch (node.type) {
    case 'paragraph':
      return `<p${alignStyle}>${renderInline(node.content)}</p>`;
    case 'heading': {
      const level = node.attrs?.level ?? 2;
      return `<h${level}${alignStyle}>${renderInline(node.content)}</h${level}>`;
    }
    case 'bulletList':
      return `<ul>${(node.content ?? []).map(renderListItem).join('')}</ul>`;
    case 'orderedList':
      return `<ol>${(node.content ?? []).map(renderListItem).join('')}</ol>`;
    case 'blockquote':
      return `<blockquote>${(node.content ?? []).map(renderBlock).join('')}</blockquote>`;
    case 'codeBlock':
      return `<pre><code>${escapeHtml((node.content ?? []).map((c) => c.text ?? '').join(''))}</code></pre>`;
    case 'horizontalRule':
      return '<hr>';
    case 'image': {
      const src = escapeAttr(node.attrs?.src ?? '');
      const alt = escapeAttr(node.attrs?.alt ?? '');
      const caption = node.attrs?.caption as string | undefined;

      if (!caption) {
        const style = `${imageAlignStyle(textAlign)}${imageWidthStyle(node.attrs?.width)}`;
        return `<img src="${src}" alt="${alt}"${style ? ` style="${style}"` : ''}>`;
      }

      const figureStyle = `margin:0;${imageAlignStyle(textAlign)}${imageWidthStyle(node.attrs?.width)}`;
      return `<figure style="${figureStyle}"><img src="${src}" alt="${alt}" style="display:block;width:100%;"><figcaption style="text-align:center;font-size:0.875rem;color:#6b7280;margin-top:4px;">${escapeHtml(caption)}</figcaption></figure>`;
    }
    default:
      return '';
  }
};

export const renderTiptapHtml = (doc: JSONContent): string =>
  (doc.content ?? []).map(renderBlock).join('');
