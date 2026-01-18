import { useMemo, useRef } from 'react';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import { Box, Flex, Text } from 'theme-ui';

import { AddImage } from './AddImage';

import type { MDXEditorMethods } from '@mdxeditor/editor';
import type { FieldRenderProps } from 'react-final-form';

import '@mdxeditor/editor/style.css';
import './style.css';

type FieldProps = FieldRenderProps<any, any> & { children?: React.ReactNode };

export interface IProps extends FieldProps {
  imageUploadHandler: (image: File) => Promise<string>;
  disabled?: boolean;
  children?: React.ReactNode;
  'data-cy'?: string;
}

export const FieldMarkdown = (props: IProps) => {
  const ref = useRef<MDXEditorMethods>(null);
  const { imageUploadHandler, input, meta, ...rest } = props;

  // Capture initial value once to use as key - this ensures editor remounts with new content
  // but stays mounted while typing
  const initialValueRef = useRef(input.value);
  const editorKey = useRef(initialValueRef.current ? 'has-content' : 'empty').current;

  const mainPluginList = useMemo(
    () => [
      headingsPlugin({ allowedHeadingLevels: [1, 2] }),
      listsPlugin(),
      quotePlugin(),
      imagePlugin({
        disableImageSettingsButton: true,
        disableImageResize: true,
      }),
      thematicBreakPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      diffSourcePlugin({ readOnlyDiff: true }),
      markdownShortcutPlugin(),
    ],
    [],
  );

  const toolbar = useMemo(
    () =>
      toolbarPlugin({
        toolbarContents: () => (
          <DiffSourceToggleWrapper>
            <UndoRedo />
            <BoldItalicUnderlineToggles />
            <ListsToggle />
            <CreateLink />
            <AddImage imageUploadHandler={imageUploadHandler} />
            <BlockTypeSelect />
          </DiffSourceToggleWrapper>
        ),
      }),
    [imageUploadHandler],
  );

  const showError = meta.error && meta.touched;

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      {showError && <Text sx={{ fontSize: 1, color: 'error' }}>{meta.error}</Text>}
      <Box
        sx={{
          alignSelf: 'stretch',
          fontFamily: 'body',
          lineHeight: 1.5,
          a: {
            textDecoration: 'underline',
            '&:hover': { textDecoration: 'none' },
          },
          h3: { fontSize: 2 },
          h4: { fontSize: 2 },
          h5: { fontSize: 2 },
          h6: { fontSize: 2 },
          img: {
            borderRadius: 2,
            maxWidth: '100%',
          },
        }}
      >
        <MDXEditor
          key={editorKey}
          ref={ref}
          className={showError ? 'mdxeditor-error' : ''}
          markdown={input.value}
          plugins={[toolbar, ...mainPluginList]}
          onBlur={() => input.onBlur()}
          onChange={(ev) => input.onChange(ev)}
          {...rest}
        />
      </Box>
    </Flex>
  );
};
