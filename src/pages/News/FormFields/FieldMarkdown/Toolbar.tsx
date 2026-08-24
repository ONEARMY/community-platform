import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
} from 'lucide-react';
import { Button } from 'oa-components';
import type { MediaWithPublicUrl } from 'oa-shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/ui/tooltip';
import { Flex } from 'theme-ui';
import { AddImage } from './AddImage';

interface IProps {
  editor: Editor;
  imageUploadHandler: (image: File) => Promise<MediaWithPublicUrl | null>;
}

const HEADING_LEVELS = [2, 3, 4] as const;

const BLOCK_TYPES = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'heading-2', label: 'Heading 2' },
  { value: 'heading-3', label: 'Heading 3' },
  { value: 'heading-4', label: 'Heading 4' },
  { value: 'blockquote', label: 'Quote' },
] as const;

const getActiveBlockType = (editor: Editor): string => {
  if (editor.isActive('blockquote')) {
    return 'blockquote';
  }

  for (const level of HEADING_LEVELS) {
    if (editor.isActive('heading', { level })) {
      return `heading-${level}`;
    }
  }

  return 'paragraph';
};

const setBlockType = (editor: Editor, value: string | null) => {
  if (!value) {
    return;
  }

  const chain = editor.chain().focus();

  if (value === 'blockquote') {
    chain.setBlockquote().run();
  } else if (value.startsWith('heading-')) {
    const level = Number(value.split('-')[1]) as (typeof HEADING_LEVELS)[number];
    chain.setHeading({ level }).run();
  } else {
    chain.setParagraph().run();
  }
};

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ToolbarButton = ({ label, active, disabled, onClick, children }: ToolbarButtonProps) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <Button
          small
          variant={active ? 'primary' : 'subtle'}
          type="button"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
        />
      }
    >
      {children}
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

export const Toolbar = ({ editor, imageUploadHandler }: IProps) => {
  const { selectionEmpty, linkActive } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      selectionEmpty: editor.state.selection.empty,
      linkActive: editor.isActive('link'),
    }),
  });

  return (
    <TooltipProvider>
      <Flex
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
          padding: 2,
          backgroundColor: 'white',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          borderBottom: '2px solid',
          borderColor: '#f0f0f3',
        }}
      >
        <ToolbarButton
          label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={16} />
        </ToolbarButton>

        <Select
          value={getActiveBlockType(editor)}
          onValueChange={(value) => setBlockType(editor, value)}
        >
          <SelectTrigger size="sm" className="h-8 w-36" aria-label="Block type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BLOCK_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ToolbarButton
          label="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline size={16} />
        </ToolbarButton>

        <ToolbarButton
          label="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarButton
          label="Link"
          active={linkActive}
          disabled={selectionEmpty && !linkActive}
          onClick={() => editor.chain().focus().extendMarkRange('link').setLink({ href: '' }).run()}
        >
          <LinkIcon size={16} />
        </ToolbarButton>

        <AddImage editor={editor} imageUploadHandler={imageUploadHandler} />

        <ToolbarButton
          label="Align left"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Align center"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Align right"
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight size={16} />
        </ToolbarButton>
      </Flex>
    </TooltipProvider>
  );
};
