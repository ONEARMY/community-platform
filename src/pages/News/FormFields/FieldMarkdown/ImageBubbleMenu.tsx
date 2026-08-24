import type { Editor } from '@tiptap/react';
import { BubbleMenu, useEditorState } from '@tiptap/react';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { Button } from 'oa-components';
import { IMAGE_WIDTH_PRESETS } from 'src/utils/tiptapExtensions';
import { Flex } from 'theme-ui';

interface IProps {
  editor: Editor;
}

const bubbleSx = {
  alignItems: 'center',
  gap: 1,
  padding: 1,
  backgroundColor: 'white',
  border: '2px solid',
  borderColor: '#f0f0f3',
  borderRadius: 2,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
};

export const ImageBubbleMenu = ({ editor }: IProps) => {
  const { textAlign, width } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      textAlign: editor.getAttributes('image').textAlign as string | undefined,
      width: (editor.getAttributes('image').width as string | undefined) ?? '100%',
    }),
  });

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="imageBubbleMenu"
      shouldShow={({ editor }) => editor.isActive('image')}
      tippyOptions={{ placement: 'top', offset: [0, 8] }}
    >
      <Flex sx={bubbleSx}>
        <Button
          small
          variant={textAlign === 'left' ? 'primary' : 'subtle'}
          type="button"
          aria-label="Align left"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft size={14} />
        </Button>
        <Button
          small
          variant={textAlign === 'center' ? 'primary' : 'subtle'}
          type="button"
          aria-label="Align center"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter size={14} />
        </Button>
        <Button
          small
          variant={textAlign === 'right' ? 'primary' : 'subtle'}
          type="button"
          aria-label="Align right"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight size={14} />
        </Button>

        <Flex sx={{ width: '2px', alignSelf: 'stretch', backgroundColor: '#f0f0f3', mx: 1 }} />

        {IMAGE_WIDTH_PRESETS.map((preset) => (
          <Button
            key={preset}
            small
            variant={width === preset ? 'primary' : 'subtle'}
            type="button"
            aria-label={`Resize to ${preset}`}
            onClick={() =>
              editor.chain().focus().updateAttributes('image', { width: preset }).run()
            }
          >
            {preset}
          </Button>
        ))}
      </Flex>
    </BubbleMenu>
  );
};
