import { mergeAttributes, Node } from '@tiptap/core';
import TiptapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ImageNodeView } from 'src/pages/News/FormFields/FieldRichText/ImageNodeView';
import { YoutubeNodeView } from 'src/pages/News/FormFields/FieldRichText/YoutubeNodeView';

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
      caption: {
        default: null,
      },
    };
  },
  // Renders the live editor view as an actual <figure>/<figcaption> with a plain
  // <input> for the caption, instead of a nested ProseMirror-editable text node —
  // the caption is a single line of plain text, so a real form control is far
  // simpler than giving the image node real (schema-managed) editable content.
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
  // Only used for HTML export (copy/paste) now that the live view is a NodeView —
  // keep it in sync with ImageNodeView.tsx and renderTiptapHtml.ts's image case.
  renderHTML({ node, HTMLAttributes }) {
    // Drop `style` here: TextAlign's global attribute already ran and set it to
    // `text-align: ...`, which does nothing on an <img>. Read the real value off the
    // node itself instead of HTMLAttributes.textAlign (TextAlign's renderHTML consumes
    // that key and doesn't pass it through).
    const { style: _discardTextAlignStyle, ...rest } = HTMLAttributes;
    const textAlign = node.attrs.textAlign;
    const width = node.attrs.width as string | null;
    const caption = node.attrs.caption as string | null;
    const alignStyle =
      textAlign === 'center'
        ? 'display:block;margin:0 auto;'
        : textAlign === 'right'
          ? 'display:block;margin:0 0 0 auto;'
          : '';
    const style = `${alignStyle}${width ? `width:${width};` : ''}`;
    const img = ['img', mergeAttributes(rest, style ? { style } : {})] as const;

    if (!caption) {
      return img;
    }

    return [
      'figure',
      { style: `margin:0;${style}` },
      ['img', mergeAttributes(rest, { style: 'display:block;width:100%;' })],
      ['figcaption', {}, caption],
    ];
  },
});

// Matches the wrapper markup `processYouTubeLinks`/`processStandaloneYouTubeUrls`
// (shared/utils/youtube.ts) already produce for plain-text/pasted-link YouTube URLs in
// legacy Markdown content, so both paths render identically on the web article view.
export const YOUTUBE_EMBED_WRAPPER_STYLE =
  'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin:16px 0;';
export const YOUTUBE_IFRAME_STYLE = 'position:absolute;top:0;left:0;width:100%;height:100%;';

export const Youtube = Node.create({
  name: 'youtube',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      videoId: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-youtube-video]' }];
  },
  // Only used for HTML export (copy/paste) — the live view is a NodeView (YoutubeNodeView.tsx)
  // and the web article view goes through renderTiptapHtml.ts's own youtube case; keep all
  // three in sync.
  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-youtube-video': '',
        style: YOUTUBE_EMBED_WRAPPER_STYLE,
      }),
      [
        'iframe',
        {
          src: `https://www.youtube.com/embed/${node.attrs.videoId}`,
          style: YOUTUBE_IFRAME_STYLE,
          frameborder: '0',
          allowfullscreen: 'true',
          title: 'YouTube video player',
        },
      ],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(YoutubeNodeView);
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
  Link.configure({
    openOnClick: false,
  }),
  Image,
  Youtube,
];
