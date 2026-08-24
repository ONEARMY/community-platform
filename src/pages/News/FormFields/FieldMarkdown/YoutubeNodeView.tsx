import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';

// Matches YOUTUBE_EMBED_WRAPPER_STYLE/YOUTUBE_IFRAME_STYLE in tiptapExtensions.ts (used for
// HTML export) and renderTiptapHtml.ts's youtube case (used for the web article view).
export const YoutubeNodeView = ({ node, selected }: NodeViewProps) => {
  const { videoId } = node.attrs;

  return (
    <NodeViewWrapper
      contentEditable={false}
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        maxWidth: '100%',
        margin: '16px 0',
        borderRadius: 8,
        outline: selected ? '2px solid #4f8edc' : 'none',
        outlineOffset: 2,
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        allowFullScreen
        title="YouTube video player"
      />
    </NodeViewWrapper>
  );
};
