import { mergeAttributes } from '@tiptap/core';
import TiptapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

/**
 * CSS `text-align` has no visual effect on an `<img>` element (it only affects inline
 * content inside a block container), so the stock @tiptap/extension-image + TextAlign
 * combo silently fails to center images. This override translates the `textAlign`
 * attribute (still contributed by TextAlign's `types` list, so the JSON keeps a plain
 * `attrs.textAlign` like any other aligned node) into `display`/`margin` instead.
 *
 * This is for browser-rendered surfaces (the editor's own view, and the web page via
 * generateHTML) only. Email uses a separate renderer (see renderTiptapEmail) that needs
 * a table-based `align` attribute instead, since Outlook doesn't reliably honor `margin: auto`.
 */
export const IMAGE_WIDTH_PRESETS = ['25%', '50%', '75%', '100%'] as const;

export const Image = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    // Drop `style` here: TextAlign's global attribute already ran and set it to
    // `text-align: ...`, which does nothing on an <img>. Read the real value off the
    // node itself instead of HTMLAttributes.textAlign (TextAlign's renderHTML consumes
    // that key and doesn't pass it through).
    const { style: _discardTextAlignStyle, ...rest } = HTMLAttributes;
    const textAlign = node.attrs.textAlign;
    const width = node.attrs.width as string | null;
    const alignStyle =
      textAlign === 'center'
        ? 'display:block;margin:0 auto;'
        : textAlign === 'right'
          ? 'display:block;margin:0 0 0 auto;'
          : '';
    const style = `${alignStyle}${width ? `width:${width};` : ''}`;

    return ['img', mergeAttributes(rest, style ? { style } : {})];
  },
});

export const TIPTAP_EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
  }),
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph', 'image'],
  }),
  Link,
  Image,
];
