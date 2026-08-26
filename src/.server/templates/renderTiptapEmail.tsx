import type { JSONContent } from '@tiptap/core';
import { Column, Heading, Img, Link, Row, Text } from 'react-email';

// Mirrors node_modules/react-email/src/components/markdown/styles.ts so a row rendered
// from `content` looks the same as one rendered via react-email's own <Markdown> component.
const baseHeaderStyle = { fontWeight: 500, paddingTop: 20 };
const headingStyles: Record<number, React.CSSProperties> = {
  2: { ...baseHeaderStyle, fontSize: '2rem' },
  3: { ...baseHeaderStyle, fontSize: '1.75rem' },
  4: { ...baseHeaderStyle, fontSize: '1.5rem' },
};

const blockQuoteStyle: React.CSSProperties = {
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 10,
  paddingBottom: 10,
  margin: 0,
  marginBottom: 15,
  backgroundColor: '#f4f8fd',
  borderLeft: '3px solid #c8d8ec',
};
const linkStyle: React.CSSProperties = {
  color: '#007bff',
  textDecoration: 'underline',
  backgroundColor: 'transparent',
};
const imageStyle: React.CSSProperties = { width: '100%', borderRadius: '10px' };
const imageCaptionStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  marginTop: 4,
};

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
  color: '#6b7280',
  textAlign: 'center',
  marginTop: 4,
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
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="YouTube video thumbnail"
            style={youtubeThumbnailStyle}
          />
        </Link>
        <Text style={youtubeCaptionStyle}>▶ Watch the video</Text>
      </Column>
    </Row>
  );
};

const renderImage = (node: JSONContent, key: number | string): React.ReactNode => {
  const width = isImageWidth(node.attrs?.width) ? node.attrs.width : imageStyle.width;
  const caption = node.attrs?.caption as string | undefined;
  const textAlign = (node.attrs?.textAlign as 'left' | 'center' | 'right' | undefined) ?? 'left';
  const img = (
    <Img
      key={key}
      src={node.attrs?.src}
      alt={node.attrs?.alt ?? ''}
      style={{ ...imageStyle, width }}
    />
  );

  // A caption needs a place to sit below the image regardless of alignment, so
  // always use the table-based Row/Column wrapper once one is present (Outlook
  // doesn't reliably honor margin/display-based layout for this).
  if (!caption && textAlign === 'left') {
    return img;
  }

  return (
    <Row key={key}>
      <Column align={textAlign}>
        {img}
        {caption && <Text style={{ ...imageCaptionStyle, textAlign: 'center' }}>{caption}</Text>}
      </Column>
    </Row>
  );
};

const renderBlock = (node: JSONContent, key: number | string): React.ReactNode => {
  const textAlign = node.attrs?.textAlign as React.CSSProperties['textAlign'] | undefined;

  switch (node.type) {
    case 'paragraph':
      return (
        <Text key={key} style={{ textAlign }}>
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
      return <ul key={key}>{node.content?.map((item, i) => renderListItem(item, i))}</ul>;
    case 'orderedList':
      return <ol key={key}>{node.content?.map((item, i) => renderListItem(item, i))}</ol>;
    case 'blockquote':
      return (
        <blockquote key={key} style={blockQuoteStyle}>
          {node.content?.map((child, i) => renderBlock(child, i))}
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
  <li key={key}>{node.content?.map((child, i) => renderBlock(child, i))}</li>
);

export const renderTiptapEmail = (doc: JSONContent): React.ReactNode =>
  doc.content?.map((node, i) => renderBlock(node, i));
