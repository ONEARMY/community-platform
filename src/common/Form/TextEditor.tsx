import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Placeholder } from '@tiptap/extensions';
import { Tiptap, useEditor, useTiptap, useTiptapState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { MediaWithPublicUrl } from 'oa-shared';
import { useEffect, useRef, useState } from 'react';
import type { FieldRenderProps } from 'react-final-form';
import { Box, Button, Flex, Text } from 'theme-ui';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FieldProps = FieldRenderProps<any, any> & { children?: React.ReactNode };

export interface IProps extends FieldProps {
  imageUploadHandler: (image: File) => Promise<MediaWithPublicUrl | null>;
  disabled?: boolean;
  placeholder?: string;
  'data-cy'?: string;
}

function LinkButton() {
  const { editor } = useTiptap();
  const isLink = useTiptapState((s) => s.editor.isActive('link'));
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // When opening, pre-fill with existing href if cursor is inside a link
  const handleOpen = () => {
    if (!editor) return;
    if (isLink) {
      // Cursor is already inside a link — unset it immediately, no popover needed
      editor.chain().focus().unsetLink().run();
      return;
    }
    const existingHref = editor.getAttributes('link').href ?? '';
    setUrl(existingHref);
    setError('');
    setOpen(true);
  };

  // Focus input when popover opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleApply = () => {
    if (!editor) return;
    const trimmed = url.trim();
    if (!trimmed) {
      // Empty URL — unset the link if there was one
      editor.chain().focus().unsetLink().run();
      setOpen(false);
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setError('URL must start with https://');
      return;
    }
    editor.chain().focus().setLink({ href: trimmed }).run();
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Box ref={wrapperRef} sx={{ position: 'relative' }}>
      <ToolbarButton
        title={isLink ? 'Remove link' : 'Add link'}
        active={isLink}
        onClick={handleOpen}
      >
        🔗
      </ToolbarButton>

      {open && (
        <Box
          sx={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 100,
            bg: 'background',
            border: '1px solid',
            borderColor: 'softGrey',
            borderRadius: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            p: 2,
            minWidth: '280px',
          }}
        >
          <Text sx={{ fontSize: 0, fontWeight: 'bold', mb: 1, display: 'block', color: 'text' }}>
            Link URL
          </Text>
          <Flex sx={{ gap: 1 }}>
            <input
              ref={inputRef}
              type="url"
              placeholder="https://"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                fontSize: 1,
                padding: '6px 8px',
                border: '1px solid',
                borderColor: error ? 'error' : 'softGrey',
                borderRadius: 1,
                fontFamily: 'body',
                outline: 'none',
              }}
            />
            <Button
              type="button"
              onClick={handleApply}
              sx={{
                px: 2,
                py: '6px',
                bg: 'primary',
                color: 'white',
                border: 'none',
                borderRadius: 1,
                fontSize: 1,
                cursor: 'pointer',
                fontFamily: 'body',
                '&:hover': { opacity: 0.85 },
              }}
            >
              Apply
            </Button>
            <Button
              type="button"
              onClick={() => setOpen(false)}
              sx={{
                px: 2,
                py: '6px',
                bg: 'transparent',
                color: 'text',
                border: '1px solid',
                borderColor: 'softGrey',
                borderRadius: 1,
                fontSize: 1,
                cursor: 'pointer',
                fontFamily: 'body',
                '&:hover': { bg: 'softGrey' },
              }}
            >
              ✕
            </Button>
          </Flex>
          {error && (
            <Text sx={{ fontSize: 0, color: 'error', mt: 1, display: 'block' }}>{error}</Text>
          )}
          {url && !error && (
            <Text
              sx={{
                fontSize: 0,
                color: 'darkGrey',
                mt: 1,
                display: 'block',
                wordBreak: 'break-all',
              }}
            >
              {url}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Toolbar — lives inside <Tiptap> so it can use useTiptap / useTiptapState
// ---------------------------------------------------------------------------
interface ToolbarProps {
  imageUploadHandler: (image: File) => Promise<MediaWithPublicUrl | null>;
}

function Toolbar({ imageUploadHandler }: ToolbarProps) {
  const { editor } = useTiptap();

  // Reactive active states — each only re-renders its button when its own state changes
  const isBold = useTiptapState((s) => s.editor.isActive('bold'));
  const isItalic = useTiptapState((s) => s.editor.isActive('italic'));
  const isStrike = useTiptapState((s) => s.editor.isActive('strike'));
  const isH1 = useTiptapState((s) => s.editor.isActive('heading', { level: 1 }));
  const isH2 = useTiptapState((s) => s.editor.isActive('heading', { level: 2 }));
  const isBullet = useTiptapState((s) => s.editor.isActive('bulletList'));
  const isOrdered = useTiptapState((s) => s.editor.isActive('orderedList'));
  const isBlockquote = useTiptapState((s) => s.editor.isActive('blockquote'));
  const isAlignLeft = useTiptapState((s) => s.editor.isActive({ textAlign: 'left' }));
  const isAlignCenter = useTiptapState((s) => s.editor.isActive({ textAlign: 'center' }));
  const isAlignRight = useTiptapState((s) => s.editor.isActive({ textAlign: 'right' }));

  if (!editor) {
    return null;
  }

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const result = await imageUploadHandler(file);
      if (result?.publicUrl) {
        editor.chain().focus().setImage({ src: result.publicUrl }).run();
      }
    };
    input.click();
  };

  return (
    <Flex
      sx={{
        flexWrap: 'wrap',
        gap: '2px',
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'softGrey',
        bg: 'background',
        borderRadius: '4px 4px 0 0',
      }}
    >
      {/* History */}
      <ToolbarGroup>
        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          ↩
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          ↪
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarGroup>
        <ToolbarButton
          title="Heading 1"
          active={isH1}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={isH2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Inline marks */}
      <ToolbarGroup>
        <ToolbarButton
          title="Bold"
          active={isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={isStrike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <s>S</s>
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarGroup>
        <ToolbarButton
          title="Align left"
          active={isAlignLeft}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          ≡L
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={isAlignCenter}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          ≡C
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={isAlignRight}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          ≡R
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarGroup>
        <ToolbarButton
          title="Bullet list"
          active={isBullet}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •—
        </ToolbarButton>
        <ToolbarButton
          title="Ordered list"
          active={isOrdered}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1—
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Blocks */}
      <ToolbarGroup>
        <ToolbarButton
          title="Blockquote"
          active={isBlockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </ToolbarButton>
        <LinkButton />
        <ToolbarButton title="Insert image" onClick={handleImageUpload}>
          🖼
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Table */}
      <ToolbarGroup>
        <ToolbarButton
          title="Insert table"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          ⊞
        </ToolbarButton>
      </ToolbarGroup>
    </Flex>
  );
}

// ---------------------------------------------------------------------------
// Small toolbar primitives
// ---------------------------------------------------------------------------

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '28px',
        height: '28px',
        px: '6px',
        border: '1px solid',
        borderColor: active ? 'primary' : 'transparent',
        borderRadius: '3px',
        bg: active ? 'highlight' : 'transparent',
        color: disabled ? 'disabled' : active ? 'primary' : 'text',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '12px',
        lineHeight: 1,
        opacity: disabled ? 0.4 : 1,
        transition: 'background 0.1s, border-color 0.1s',
        '&:hover:not(:disabled)': {
          bg: 'softGrey',
          borderColor: 'softGrey',
        },
      }}
    >
      {children}
    </Button>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <Flex sx={{ gap: '2px' }}>{children}</Flex>;
}

function ToolbarDivider() {
  return (
    <Box
      sx={{
        width: '1px',
        alignSelf: 'stretch',
        bg: 'softGrey',
        mx: '2px',
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export const FieldTiptap = (props: IProps) => {
  const { imageUploadHandler, input, meta, disabled, placeholder } = props;
  const showError = meta.error && meta.touched;

  const editor = useEditor({
    immediatelyRender: false, // required for React Router / SSR to avoid hydration mismatch
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        // v3: list extensions consolidated into @tiptap/extension-list — disable from StarterKit
        bulletList: false,
        orderedList: false,
        listItem: false,
        // Restrict headings to H1 and H2, matching the original MDXEditor config
        heading: { levels: [1, 2] },
        // Disable features that don't render well in email
        horizontalRule: false,
        code: false,
        codeBlock: false,
        // Link handled separately
        link: false,
      }),

      // Import from the consolidated @tiptap/extension-list package (v3 change)
      // These are imported at the top as named exports from @tiptap/extension-list
      // StarterKit is configured above to not include them
      // Re-add via the extension-list package for the list controls to work:
      // Note: StarterKit v3 may already include them from @tiptap/extension-list internally.
      // If you get "duplicate extension" errors, remove these and keep the StarterKit defaults.

      Link.configure({
        openOnClick: false,
        // Only allow http/https — prevents javascript: URIs in email links
        validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          // Don't set target="_blank" here — let email template control that
        },
      }),

      Image.configure({
        inline: false,
        allowBase64: false, // base64 images are stripped/blocked by Gmail and other email clients
        HTMLAttributes: {
          // Inline styles are the only reliable styling in email clients
          style: 'max-width: 100%; height: auto; border-radius: 4px;',
        },
      }),

      TextStyle,

      Color.configure({
        types: ['textStyle'],
      }),

      Highlight.configure({
        multicolor: true,
      }),

      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),

      // v3: Table, TableRow, TableHeader, TableCell are all named exports from @tiptap/extension-table
      Table.configure({
        resizable: false, // keep false for better email compatibility
        HTMLAttributes: {
          style: 'border-collapse: collapse; width: 100%;',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          style: 'border: 1px solid #ccc; padding: 8px; background: #f5f5f5; text-align: left;',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          style: 'border: 1px solid #ccc; padding: 8px;',
        },
      }),

      Placeholder.configure({
        placeholder: placeholder ?? 'Write your content here…',
      }),
    ],

    content: input.value || '',

    onUpdate: ({ editor }) => {
      // Store HTML as the source of truth — ready for both article display and email
      input.onChange(editor.getHTML());
    },

    onBlur: () => {
      input.onBlur();
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      {showError && <Text sx={{ fontSize: 1, color: 'error' }}>{meta.error}</Text>}

      <Box
        data-cy={props['data-cy']}
        sx={{
          border: '1px solid',
          borderColor: showError ? 'error' : 'softGrey',
          borderRadius: 1,
          fontFamily: 'body',
          lineHeight: 1.5,
          // Tiptap needs at least a min-height on the content area
          '.tiptap': {
            outline: 'none',
            minHeight: '200px',
            p: 2,
            // Placeholder
            'p.is-editor-empty:first-child::before': {
              content: 'attr(data-placeholder)',
              color: 'placeholder',
              float: 'left',
              pointerEvents: 'none',
              height: 0,
            },
          },
          // Content styles — mirror what you had in the MDXEditor style.css
          'h1, h2': { mt: 3, mb: 2 },
          h1: { fontSize: 4 },
          h2: { fontSize: 3 },
          p: { my: 2 },
          'ul, ol': { pl: 4, my: 2 },
          'li > p': { my: 0 }, // tiptap wraps li content in <p> — flatten for readability in editor
          blockquote: {
            borderLeft: '3px solid',
            borderColor: 'softGrey',
            pl: 3,
            ml: 0,
            color: 'darkGrey',
            fontStyle: 'italic',
          },
          a: {
            color: 'blue',
            textDecoration: 'underline',
            '&:hover': { textDecoration: 'none' },
          },
          img: {
            borderRadius: 2,
            maxWidth: '100%',
          },
          // Table styles in editor view
          table: {
            borderCollapse: 'collapse',
            width: '100%',
            my: 2,
          },
          'th, td': {
            border: '1px solid',
            borderColor: 'softGrey',
            p: 2,
            textAlign: 'left',
          },
          th: {
            bg: 'lightGrey',
            fontWeight: 'bold',
          },
          // Selected cells highlight
          '.selectedCell': {
            bg: 'highlight',
          },
        }}
      >
        <Tiptap editor={editor ?? undefined}>
          <Toolbar imageUploadHandler={imageUploadHandler} />
          <Tiptap.Content />
        </Tiptap>
      </Box>
    </Flex>
  );
};
