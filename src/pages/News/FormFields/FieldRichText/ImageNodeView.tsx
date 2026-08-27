import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { Textarea } from 'src/components/ui/textarea';
import { CAPTION_MAX_LENGTH } from 'src/utils/tiptapExtensions';

export const ImageNodeView = ({ node, updateAttributes, selected }: NodeViewProps) => {
  const { src, alt, width, caption } = node.attrs;
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
        margin: '0 auto 1rem',
        width: width || '100%',
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
      {/* field-sizing-content (from the base Textarea component) grows this to fit its
          wrapped content, so long captions break onto new lines exactly like the real
          figcaption on the news page/email — the same styling (text-sm/leading-normal/
          mt-1/text-[#6b7280]) matches renderTiptapHtml.ts and renderTiptapEmail.tsx too.
          The caption itself stays a single line of text (no manual paragraph breaks):
          Enter is swallowed and any pasted newlines are stripped. */}
      <Textarea
        value={captionDraft}
        placeholder="Add a caption..."
        rows={1}
        maxLength={CAPTION_MAX_LENGTH}
        onChange={(e) => setCaptionDraft(e.target.value.replace(/\s*[\r\n]+\s*/g, ' ').trimStart())}
        onBlur={commitCaption}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        className="mt-1 min-h-0 resize-none rounded-none border-none bg-transparent p-0 text-center text-sm leading-normal text-[#6b7280] shadow-none focus-visible:border-transparent focus-visible:ring-0"
      />
    </NodeViewWrapper>
  );
};
