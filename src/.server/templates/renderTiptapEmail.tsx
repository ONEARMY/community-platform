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
  background: '#f9f9f9',
  borderLeft: '10px solid #ccc',
  margin: '1.5em 10px',
  padding: '1em 10px',
};
const linkStyle: React.CSSProperties = {
  color: '#007bff',
  textDecoration: 'underline',
  backgroundColor: 'transparent',
};
const imageStyle: React.CSSProperties = { width: '100%', borderRadius: '10px' };

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
        content = (
          <Link key={`${key}-a`} href={mark.attrs?.href} style={linkStyle}>
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

const renderImage = (node: JSONContent, key: number | string): React.ReactNode => {
  const width = isImageWidth(node.attrs?.width) ? node.attrs.width : imageStyle.width;
  const img = (
    <Img
      key={key}
      src={node.attrs?.src}
      alt={node.attrs?.alt ?? ''}
      style={{ ...imageStyle, width }}
    />
  );
  const textAlign = node.attrs?.textAlign;

  if (textAlign === 'center' || textAlign === 'right') {
    return (
      <Row key={key}>
        <Column align={textAlign}>{img}</Column>
      </Row>
    );
  }

  return img;
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
