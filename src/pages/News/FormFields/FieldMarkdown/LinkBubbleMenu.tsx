import type { Editor } from '@tiptap/react';
import { BubbleMenu, useEditorState } from '@tiptap/react';
import { Check, ExternalLink, Link2Off } from 'lucide-react';
import { Button } from 'oa-components';
import { useEffect, useRef, useState } from 'react';
import { Flex, Input } from 'theme-ui';

interface IProps {
  editor: Editor;
}

export const LinkBubbleMenu = ({ editor }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [href, setHref] = useState('');

  const { activeHref } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      activeHref: (editor.getAttributes('link').href as string | undefined) ?? '',
    }),
  });

  // Reset the draft input whenever the bubble targets a different link.
  useEffect(() => {
    setHref(activeHref);
  }, [activeHref]);

  const applyLink = () => {
    const trimmed = href.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run();
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="linkBubbleMenu"
      shouldShow={({ editor }) => editor.isActive('link')}
      tippyOptions={{
        placement: 'bottom',
        offset: [0, 8],
        onShow: () => {
          requestAnimationFrame(() => inputRef.current?.focus());
        },
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          gap: 1,
          padding: 1,
          backgroundColor: 'white',
          border: '2px solid',
          borderColor: '#f0f0f3',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Input
          ref={inputRef}
          value={href}
          placeholder="https://..."
          onChange={(e) => setHref(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              applyLink();
            }
          }}
          sx={{ width: '220px', fontSize: 1, padding: 1, height: '2rem' }}
        />
        <Button small variant="subtle" type="button" aria-label="Apply link" onClick={applyLink}>
          <Check size={14} />
        </Button>
        {activeHref && (
          <Button
            small
            variant="subtle"
            type="button"
            aria-label="Open link in a new tab"
            onClick={() => window.open(activeHref, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink size={14} />
          </Button>
        )}
        <Button
          small
          variant="subtle"
          type="button"
          aria-label="Remove link"
          onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
        >
          <Link2Off size={14} />
        </Button>
      </Flex>
    </BubbleMenu>
  );
};
