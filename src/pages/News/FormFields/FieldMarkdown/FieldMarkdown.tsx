import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect } from 'react';
import type { FieldRenderProps } from 'react-final-form';
import { TIPTAP_EXTENSIONS } from 'src/utils/tiptapExtensions';
import { Box, Flex, Text } from 'theme-ui';
import { ImageBubbleMenu } from './ImageBubbleMenu';
import { LinkBubbleMenu } from './LinkBubbleMenu';
import { Toolbar } from './Toolbar';

import './style.css';
import { MediaWithPublicUrl } from 'oa-shared';

type FieldProps = FieldRenderProps<any, any> & { children?: React.ReactNode };

export interface IProps extends FieldProps {
  imageUploadHandler: (image: File) => Promise<MediaWithPublicUrl | null>;
  disabled?: boolean;
  children?: React.ReactNode;
  'data-cy'?: string;
}

export const FieldMarkdown = (props: IProps) => {
  const { imageUploadHandler, input, meta, placeholder, disabled, ...rest } = props;

  const editor = useEditor({
    extensions: [...TIPTAP_EXTENSIONS, Placeholder.configure({ placeholder })],
    content: input.value || null,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      input.onChange(editor.getJSON());
    },
    onBlur: () => {
      input.onBlur();
    },
  });

  // Keep the editor in sync if the form resets the field's value out from under it
  // (e.g. switching between draft/published data), without remounting on every keystroke.
  useEffect(() => {
    if (!editor || editor.isFocused) {
      return;
    }
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(input.value || null);
    if (current !== next) {
      editor.commands.setContent(input.value || null, false);
    }
  }, [editor, input.value]);

  const showError = meta.error && meta.touched;

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      {showError && <Text sx={{ fontSize: 1, color: 'error' }}>{meta.error}</Text>}
      <Box
        className={showError ? 'field-markdown-error' : ''}
        sx={{
          alignSelf: 'stretch',
          fontFamily: 'body',
          lineHeight: 1.5,
          border: '2px solid',
          borderColor: showError ? 'error' : '#f0f0f3',
          borderRadius: 2,
          a: {
            textDecoration: 'underline',
            '&:hover': { textDecoration: 'none' },
          },
          img: {
            borderRadius: 2,
            maxWidth: '100%',
          },
          p: {
            marginBottom: 3,
          },
          h1: { fontSize: 7, fontWeight: 'bold', marginTop: 4, marginBottom: 2 },
          h2: { fontSize: 6, fontWeight: 'bold', marginTop: 4, marginBottom: 2 },
          h3: { fontSize: 5, fontWeight: 'bold', marginTop: 4, marginBottom: 2 },
          h4: { fontSize: 4, fontWeight: 'bold', marginTop: 4, marginBottom: 2 },
          h5: { fontSize: 3, fontWeight: 'bold', marginTop: 4, marginBottom: 2 },
          h6: { fontSize: 2, fontWeight: 'bold', marginTop: 4, marginBottom: 2 },
          'ul, ol': {
            marginBottom: 3,
            paddingLeft: 8,
          },
          ul: { listStyle: 'disc' },
          ol: { listStyle: 'decimal' },
          li: { marginBottom: 1 },
          blockquote: {
            paddingX: 4,
            paddingY: 2,
            margin: 0,
            marginBottom: 3,
            backgroundColor: '#f4f8fd',
            borderLeft: '3px solid #c8d8ec',
          },
        }}
        {...rest}
      >
        {editor && <Toolbar editor={editor} imageUploadHandler={imageUploadHandler} />}
        <Box sx={{ padding: 3 }}>
          {editor && <ImageBubbleMenu editor={editor} />}
          {editor && <LinkBubbleMenu editor={editor} />}
          <EditorContent editor={editor} />
        </Box>
      </Box>
    </Flex>
  );
};
