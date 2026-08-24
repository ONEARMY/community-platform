import type { Editor } from '@tiptap/react';
import { BubbleMenu, useEditorState } from '@tiptap/react';
import { ExternalLink, Eye, Link2Off } from 'lucide-react';
import { Button } from 'oa-components';
import { useEffect, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/ui/tooltip';
import { Flex, Input } from 'theme-ui';

interface IProps {
  editor: Editor;
}

// Same-origin links default to opening in the current tab, external ones to a new tab —
// the user can always override this per-link via the new-tab toggle below.
const isExternalUrl = (href: string): boolean => {
  if (!href) {
    return false;
  }
  try {
    return new URL(href, window.location.origin).origin !== window.location.origin;
  } catch {
    return true;
  }
};

export const LinkBubbleMenu = ({ editor }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [href, setHref] = useState('');

  const { activeHref, activeTarget } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      activeHref: (editor.getAttributes('link').href as string | undefined) ?? '',
      activeTarget: editor.getAttributes('link').target as string | undefined,
    }),
  });

  // Reset the draft input whenever the bubble targets a different link.
  useEffect(() => {
    setHref(activeHref);
  }, [activeHref]);

  const openInNewTab = activeTarget ? activeTarget === '_blank' : isExternalUrl(activeHref);

  const applyHref = () => {
    const trimmed = href.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: trimmed, target: openInNewTab ? '_blank' : '_self' })
      .run();
  };

  const toggleNewTab = () => {
    const trimmed = href.trim();
    if (!trimmed) {
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: trimmed, target: openInNewTab ? '_self' : '_blank' })
      .run();
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="linkBubbleMenu"
      shouldShow={({ editor }) => editor.isActive('link')}
      tippyOptions={{
        placement: 'bottom',
        offset: [0, 8],
        zIndex: 3,
        onShow: () => {
          requestAnimationFrame(() => inputRef.current?.focus());
        },
      }}
    >
      <TooltipProvider>
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
            onBlur={applyHref}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyHref();
              }
            }}
            sx={{ width: '220px', fontSize: 1, padding: 1, height: '2rem' }}
          />

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  small
                  variant={openInNewTab ? 'primary' : 'subtle'}
                  type="button"
                  aria-label={openInNewTab ? 'Opens in a new tab' : 'Opens in the same tab'}
                  onClick={toggleNewTab}
                />
              }
            >
              <ExternalLink size={14} />
            </TooltipTrigger>
            <TooltipContent>
              {openInNewTab ? 'Opens in a new tab' : 'Opens in the same tab'}
            </TooltipContent>
          </Tooltip>

          {activeHref && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    small
                    variant="subtle"
                    type="button"
                    aria-label="Preview link"
                    onClick={() => window.open(activeHref, '_blank', 'noopener,noreferrer')}
                  />
                }
              >
                <Eye size={14} />
              </TooltipTrigger>
              <TooltipContent>Preview link</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  small
                  variant="subtle"
                  type="button"
                  aria-label="Remove link"
                  onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
                />
              }
            >
              <Link2Off size={14} />
            </TooltipTrigger>
            <TooltipContent>Remove link</TooltipContent>
          </Tooltip>
        </Flex>
      </TooltipProvider>
    </BubbleMenu>
  );
};
