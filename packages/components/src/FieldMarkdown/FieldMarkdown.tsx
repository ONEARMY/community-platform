import type { MDXEditorMethods } from '@mdxeditor/editor';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  DiffSourceToggleWrapper,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  ListsToggle,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import { useMemo, useRef } from 'react';
import type { FieldRenderProps } from 'react-final-form';
import { Box, Flex, Text } from 'theme-ui';
import { AddImage } from './AddImage';

import '@mdxeditor/editor/style.css';
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
  const ref = useRef<MDXEditorMethods>(null);
  const { imageUploadHandler, input, meta, ...rest } = props;

  // Capture initial value once to use as key - this ensures editor remounts with new content
  // but stays mounted while typing
  const initialValueRef = useRef(input.value);
  const editorKey = useRef(initialValueRef.current ? 'has-content' : 'empty').current;

  const mainPluginList = useMemo(
    () => [
      headingsPlugin({ allowedHeadingLevels: [2, 3, 4] }),
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
          img: {
            borderRadius: 2,
            maxWidth: '100%',
          },
          p: {
            marginBottom: 3,
          },
          h1: {
            marginTop: 4,
            marginBottom: 2,
          },
          h2: {
            marginTop: 4,
            marginBottom: 2,
          },
          h3: {
            marginTop: 4,
            marginBottom: 2,
          },
          h4: {
            marginTop: 4,
            marginBottom: 2,
          },
          h5: {
            marginTop: 4,
            marginBottom: 2,
          },
          h6: {
            marginTop: 4,
            marginBottom: 2,
          },
          'ul, ol': {
            marginBottom: 3,
            paddingLeft: 8,
          },
          ul: {
            listStyle: 'disc',
          },
          ol: {
            listStyle: 'decimal',
          },
          li: {
            marginBottom: 1,
          },
          blockQuote: {
            marginBottom: 3,
            paddingLeft: 4,
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
