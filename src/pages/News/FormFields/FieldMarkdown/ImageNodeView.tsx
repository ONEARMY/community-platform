import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useState } from 'react';

const alignStyle = (textAlign: string | undefined): React.CSSProperties => {
  if (textAlign === 'center') {
    return { marginLeft: 'auto', marginRight: 'auto' };
  }
  if (textAlign === 'right') {
    return { marginLeft: 'auto', marginRight: 0 };
  }
  return { marginLeft: 0, marginRight: 'auto' };
};

export const ImageNodeView = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const { src, alt, textAlign, width, caption } = node.attrs;
  const [captionDraft, setCaptionDraft] = useState<string>(caption ?? '');

  // Stay in sync if the caption changes from elsewhere (e.g. undo/redo).
  useEffect(() => {
    setCaptionDraft(caption ?? '');
  }, [caption]);

  const commitCaption = () => {
    if (captionDraft !== (caption ?? '')) {
      updateAttributes({ caption: captionDraft || null });
    }
  };

  return (
    <NodeViewWrapper
      as="figure"
      style={{
        margin: '0 0 1rem',
        width: width || '100%',
        ...alignStyle(textAlign),
      }}
    >
      <img
        src={src}
        alt={alt ?? ''}
        style={{
          display: 'block',
          width: '100%',
          borderRadius: 8,
          outline: selected ? '2px solid #4f8edc' : 'none',
          outlineOffset: 2,
        }}
      />
      <input
        value={captionDraft}
        placeholder="Add a caption..."
        onChange={(e) => setCaptionDraft(e.target.value)}
        onBlur={commitCaption}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        style={{
          display: 'block',
          width: '100%',
          marginTop: 6,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280',
          fontFamily: 'inherit',
        }}
      />
    </NodeViewWrapper>
  );
};
