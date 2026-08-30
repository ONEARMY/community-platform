import type { JSONContent } from '@tiptap/core';
import { Column, Heading, Img, Link, Row, Text } from 'react-email';

// Mirrors the live article view so an email looks like the web page it's generated from:
// the `sx` block on the news body <Box> in src/pages/News/NewsPage.tsx, and the shared
// theme spacing scale in packages/themes/src/common/commonStyles.ts (`space: [0, 5, 10, 15,
// 20, ...]`, i.e. index N = N * 5px, also used for `radii`).
const baseHeaderStyle = { fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.2 };
const headingStyles: Record<number, React.CSSProperties> = {
  2: { ...baseHeaderStyle, fontSize: '1.875rem', marginTop: 20, marginBottom: 10 },
  3: { ...baseHeaderStyle, fontSize: '1.5rem', marginTop: 20, marginBottom: 10 },
  4: { ...baseHeaderStyle, fontSize: '1.25rem', marginTop: 20, marginBottom: 10 },
};

const paragraphStyle: React.CSSProperties = { marginTop: 0, marginBottom: 10 };
const listStyle: React.CSSProperties = { marginBottom: 10, paddingLeft: 40 };
const listItemStyle: React.CSSProperties = { marginBottom: 0 };

const blockQuoteStyle: React.CSSProperties = {
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 10,
  paddingBottom: 10,
  margin: 0,
  marginBottom: 20,
  backgroundColor: '#f4f8fd',
  borderLeft: '3px solid #c8d8ec',
};
// The web view doesn't set an explicit link color (it falls back to the browser default),
// so there's no live value to mirror here — this keeps react-email's own <Markdown> default.
const linkStyle: React.CSSProperties = {
  color: '#007bff',
  textDecoration: 'underline',
  backgroundColor: 'transparent',
};
const imageStyle: React.CSSProperties = { width: '100%', borderRadius: '10px' };
const imageCaptionStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  lineHeight: 1.5,
  marginTop: 5,
};
// Only the captioned case has a bottom margin on the web (the `figure` wrapper) — a bare
// <img> (no caption) has none, matching the `img` selector in NewsPage.tsx's sx block.
const imageFigureMarginBottom = 20;

const renderMarks = (node: JSONContent, key: number | string): React.ReactNode => {
  let content: React.ReactNode = node.text;

  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case 'bold':
        content = <strong key={`${key}-b`}>{content}</strong>;
        break;
      case 'italic':
        content = <em key={`${key}-i`}>{content}</em>;
        break;
      case 'underline':
        content = <u key={`${key}-u`}>{content}</u>;
        break;
      case 'link':
        // Unlike the web view, email links always open in a new tab regardless of the
        // mark's saved `target` — "same tab" isn't a meaningful concept inside an email client.
        content = (
          <Link
            key={`${key}-a`}
            href={mark.attrs?.href}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            {content}
          </Link>
        );
        break;
    }
  }

  return content;
};

const renderInline = (nodes: JSONContent[] = []): React.ReactNode =>
  nodes.map((node, i) => {
    if (node.type === 'text') {
      return <span key={i}>{renderMarks(node, i)}</span>;
    }
    if (node.type === 'hardBreak') {
      return <br key={i} />;
    }
    return null;
  });

const isImageWidth = (width: unknown): width is string =>
  typeof width === 'string' && /^\d{1,3}%$/.test(width);

// `content` is untrusted (it's stored JSON, not necessarily produced by the editor's own
// AddYoutube flow), so validate the shape of a YouTube video ID before splicing it into a URL.
const isYoutubeVideoId = (videoId: unknown): videoId is string =>
  typeof videoId === 'string' && /^[a-zA-Z0-9_-]{6,15}$/.test(videoId);

const youtubeThumbnailStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '10px',
  display: 'block',
};
const youtubeCaptionStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  textAlign: 'center',
  marginTop: '10px',
  color: '#0a0a0a',
};

const youtubeCaptionUnderlineStyle: React.CSSProperties = {
  borderBottom: '1.5px solid currentColor',
  paddingBottom: '5px',
};

// Email clients don't render iframes (Gmail strips them entirely), so embed a clickable
// thumbnail linking out to YouTube instead — the standard email-safe fallback for video.
const renderYoutube = (node: JSONContent, key: number | string): React.ReactNode => {
  const videoId = node.attrs?.videoId;
  if (!isYoutubeVideoId(videoId)) {
    return null;
  }

  return (
    <Row key={key}>
      <Column>
        <Link
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="YouTube video thumbnail"
            style={youtubeThumbnailStyle}
          />
          <Text style={youtubeCaptionStyle}>
            <span style={youtubeCaptionUnderlineStyle}>🎥 Click to watch the video 👆</span>
          </Text>
        </Link>
      </Column>
    </Row>
  );
};

const renderImage = (node: JSONContent, key: number | string): React.ReactNode => {
  const width = isImageWidth(node.attrs?.width) ? node.attrs.width : imageStyle.width;
  const caption = node.attrs?.caption as string | undefined;
  const img = (
    <Img
      key={key}
      src={node.attrs?.src}
      alt={node.attrs?.alt ?? ''}
      style={{ ...imageStyle, width }}
    />
  );

  // Images are always centered. A full-width image renders the same whether centered or
  // not, so only pay for the table-based Row/Column wrapper (Outlook doesn't reliably
  // honor margin/display-based centering) when it's narrower or has a caption to place.
  if (!caption && width === imageStyle.width) {
    return img;
  }

  return (
    <Row key={key} style={caption ? { marginBottom: imageFigureMarginBottom } : undefined}>
      <Column align="center">
        {img}
        {caption && <Text style={{ ...imageCaptionStyle, textAlign: 'center' }}>{caption}</Text>}
      </Column>
    </Row>
  );
};

const renderBlock = (
  node: JSONContent,
  key: number | string,
  insideBlockquote = false,
): React.ReactNode => {
  const textAlign = node.attrs?.textAlign as React.CSSProperties['textAlign'] | undefined;

  switch (node.type) {
    case 'paragraph':
      return (
        <Text
          key={key}
          style={{
            ...paragraphStyle,
            marginBottom: insideBlockquote ? 0 : paragraphStyle.marginBottom,
            textAlign,
          }}
        >
          {renderInline(node.content)}
        </Text>
      );
    case 'heading': {
      const level = (node.attrs?.level as number) ?? 2;
      return (
        <Heading
          key={key}
          as={`h${level}` as 'h2' | 'h3' | 'h4'}
          style={{ ...headingStyles[level], textAlign }}
        >
          {renderInline(node.content)}
        </Heading>
      );
    }
    case 'bulletList':
      return (
        <ul key={key} style={{ ...listStyle, listStyleType: 'disc' }}>
          {node.content?.map((item, i) => renderListItem(item, i))}
        </ul>
      );
    case 'orderedList':
      return (
        <ol key={key} style={{ ...listStyle, listStyleType: 'decimal' }}>
          {node.content?.map((item, i) => renderListItem(item, i))}
        </ol>
      );
    case 'blockquote':
      return (
        <blockquote key={key} style={blockQuoteStyle}>
          {node.content?.map((child, i) => renderBlock(child, i, true))}
        </blockquote>
      );
    case 'image':
      return renderImage(node, key);
    case 'youtube':
      return renderYoutube(node, key);
    case 'horizontalRule':
      return <hr key={key} />;
    default:
      return null;
  }
};

const renderListItem = (node: JSONContent, key: number | string): React.ReactNode => (
  <li key={key} style={listItemStyle}>
    {node.content?.map((child, i) => renderBlock(child, i))}
  </li>
);

export const renderTiptapEmail = (doc: JSONContent): React.ReactNode =>
  doc.content?.map((node, i) => renderBlock(node, i));
