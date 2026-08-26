import type { Editor } from '@tiptap/react';
import { BubbleMenu, useEditorState } from '@tiptap/react';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { Button } from 'oa-components';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/ui/tooltip';
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

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Align left', icon: AlignLeft },
  { value: 'center', label: 'Align center', icon: AlignCenter },
  { value: 'right', label: 'Align right', icon: AlignRight },
] as const;

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
      tippyOptions={{ placement: 'top', offset: [0, 8], zIndex: 3 }}
    >
      <TooltipProvider>
        <Flex sx={bubbleSx}>
          {ALIGN_OPTIONS.map(({ value, label, icon: Icon }) => (
            <Tooltip key={value}>
              <TooltipTrigger
                render={
                  <Button
                    small
                    variant={textAlign === value ? 'primary' : 'subtle'}
                    type="button"
                    aria-label={label}
                    onClick={() => editor.chain().focus().setTextAlign(value).run()}
                  />
                }
              >
                <Icon size={14} />
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}

          <Flex sx={{ width: '2px', alignSelf: 'stretch', backgroundColor: '#f0f0f3', mx: 1 }} />

          {IMAGE_WIDTH_PRESETS.map((preset) => (
            <Tooltip key={preset}>
              <TooltipTrigger
                render={
                  <Button
                    small
                    variant={width === preset ? 'primary' : 'subtle'}
                    type="button"
                    aria-label={`Resize to ${preset}`}
                    onClick={() =>
                      editor.chain().focus().updateAttributes('image', { width: preset }).run()
                    }
                  />
                }
              >
                {preset}
              </TooltipTrigger>
              <TooltipContent>Resize to {preset}</TooltipContent>
            </Tooltip>
          ))}
        </Flex>
      </TooltipProvider>
    </BubbleMenu>
  );
};
