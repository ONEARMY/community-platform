import { useEffect, useRef } from 'react'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  InsertImage,
  InsertTable,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor'
import { Flex, Text } from 'theme-ui'

import type { MDXEditorMethods } from '@mdxeditor/editor'
import type { FieldRenderProps } from 'react-final-form'

import '@mdxeditor/editor/style.css'
import './style.css'

type FieldProps = FieldRenderProps<any, any> & { children?: React.ReactNode }

export interface IProps extends FieldProps {
  disabled?: boolean
  children?: React.ReactNode
  'data-cy'?: string
  diffMarkdown?: string
}

export const FieldMarkdown = (props: IProps) => {
  const ref = useRef<MDXEditorMethods>(null)
  const { input, meta, diffMarkdown, ...rest } = props

  useEffect(() => {
    ref.current?.getMarkdown()
  }, [])

  useEffect(() => {
    ref.current?.setMarkdown(input.value)
  }, [input.value])

  const mainPluginList = [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    tablePlugin(),
    imagePlugin(),
    thematicBreakPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    diffSourcePlugin({ diffMarkdown, viewMode: 'rich-text' }),
  ]

  const toolbar = toolbarPlugin({
    toolbarContents: () => (
      <DiffSourceToggleWrapper>
        <UndoRedo />
        <BoldItalicUnderlineToggles />
        <ListsToggle />
        <CreateLink />
        <InsertTable />
        <InsertImage />
        <BlockTypeSelect />
      </DiffSourceToggleWrapper>
    ),
  })

  const showError = meta.error && meta.touched

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      {showError && (
        <Text sx={{ fontSize: 1, color: 'error' }}>{meta.error}</Text>
      )}

      <MDXEditor
        ref={ref}
        className={showError ? 'mdxeditor-error' : ''}
        markdown={''}
        plugins={[toolbar, ...mainPluginList]}
        onBlur={() => {
          input.onBlur()
        }}
        onChange={(ev) => {
          input.onChange(ev)
        }}
        {...rest}
      />
    </Flex>
  )
}
