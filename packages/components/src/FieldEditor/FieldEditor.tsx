/* eslint-disable no-alert */
import * as linkify from 'linkifyjs'
import {
  EditorComponent,
  OnChangeJSON,
  useRemirror,
  useCommands,
  Remirror,
  FloatingWrapper,
  useMention,
  ThemeProvider,
} from '@remirror/react'
import { cx } from 'remirror'

import { useState, useEffect } from 'react'
import {
  BoldExtension,
  BulletListExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  MentionExtension,
  OrderedListExtension,
  TaskListExtension,
} from 'remirror/extensions'
import { AllStyledComponent } from '@remirror/styles/emotion'
import type { MentionExtensionAttributes } from 'remirror/extensions'
import { Button } from '../Button/Button'
import { Flex, Box } from 'theme-ui'
import styled from '@emotion/styled'

const editorButtonStyle = {
  paddingX: '.1rem',
  paddingY: 0,
  lineHeight: 1.25,
  mr: 1,
}

const Menu = () => {
  const {
    toggleBold,
    focus,
    toggleItalic,
    toggleOrderedList,
    toggleBulletList,
    toggleTaskList,
    toggleHeading,
  } = useCommands()
  return (
    <Flex>
      <Button
        onClick={(e: any) => {
          toggleBold()
          focus()
          e.preventDefault()
        }}
        variant={'outline'}
        small
        sx={editorButtonStyle}
      >
        Bold
      </Button>
      <Button
        onClick={(e: any) => {
          toggleItalic()
          focus()
          e.preventDefault()
        }}
        variant={'outline'}
        small
        sx={editorButtonStyle}
      >
        Italic
      </Button>
      <Button
        variant={'outline'}
        small
        sx={editorButtonStyle}
        onClick={(e) => {
          toggleHeading({ level: 1 })

          alert('Heading 1')
          focus()
          e.preventDefault()
        }}
      >
        h1
      </Button>
      <Button
        variant={'outline'}
        small
        sx={editorButtonStyle}
        onClick={(e) => {
          toggleHeading({ level: 2 })
          focus()
          e.preventDefault()
        }}
      >
        h2
      </Button>
      <Button
        variant={'outline'}
        small
        sx={editorButtonStyle}
        onClick={(e) => {
          toggleHeading({ level: 3 })
          focus()
          e.preventDefault()
        }}
      >
        h3
      </Button>
      <Button
        variant={'outline'}
        small
        sx={editorButtonStyle}
        onClick={(e) => {
          toggleHeading({ level: 4 })
          focus()
          e.preventDefault()
        }}
      >
        h4
      </Button>
      <Button
        variant={'outline'}
        small
        sx={editorButtonStyle}
        onClick={(e) => {
          toggleHeading({ level: 5 })
          focus()
          e.preventDefault()
        }}
      >
        h5
      </Button>
      <Button
        variant={'outline'}
        small
        sx={editorButtonStyle}
        onClick={(e) => {
          toggleHeading({ level: 6 })
          focus()
          e.preventDefault()
        }}
      >
        h6
      </Button>
      <Button
        onClick={(e: any) => {
          toggleOrderedList()
          focus()
          e.preventDefault()
        }}
        variant={'outline'}
        small
        sx={editorButtonStyle}
      >
        Numbered List
      </Button>
      <Button
        onClick={(e: any) => {
          toggleBulletList()
          focus()
          e.preventDefault()
        }}
        variant={'outline'}
        small
        sx={editorButtonStyle}
      >
        Bullet List
      </Button>
      <Button
        onClick={(e: any) => {
          toggleTaskList()
          focus()
          e.preventDefault()
        }}
        variant={'outline'}
        small
        sx={editorButtonStyle}
      >
        Task List
      </Button>
    </Flex>
  )
}

const UserSuggestor = ({
  allUsers,
}: {
  allUsers: MentionExtensionAttributes[]
}): JSX.Element => {
  const [users, setUsers] = useState<MentionExtensionAttributes[]>([])
  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } =
    useMention({
      items: users,
    })

  useEffect(() => {
    if (!state) {
      return
    }

    const searchTerm = state.query.full.toLowerCase()
    const filteredUsers = allUsers
      .filter((user) => user.label.toLowerCase().includes(searchTerm))
      .sort()
      .slice(0, 5)
    setUsers(filteredUsers)
  }, [state, allUsers])

  const enabled = !!state

  return (
    <FloatingWrapper
      positioner="cursor"
      enabled={enabled}
      placement="bottom-start"
    >
      <Box
        {...getMenuProps()}
        className="suggestions"
        sx={{
          background: 'red',
          position: 'relative',
        }}
      >
        {enabled &&
          users.map((user, index) => {
            const isHighlighted = indexIsSelected(index)
            const isHovered = indexIsHovered(index)

            return (
              <div
                key={user.id}
                className={cx(
                  'suggestion',
                  isHighlighted && 'highlighted',
                  isHovered && 'hovered',
                )}
                {...getItemProps({
                  item: user,
                  index,
                })}
              >
                {user.label}
              </div>
            )
          })}
      </Box>
    </FloatingWrapper>
  )
}

const findAutoLinks = (str: string) => {
  return linkify.find(str, 'url').map((link) => ({
    text: link.value,
    href: link.href,
    start: link.start,
    end: link.end,
  }))
}

const isValidUrl = (input: string) => linkify.test(input)

export const FieldEditor = (props: any) => {
  const { input, users: allUsers } = props

  const content =
    typeof props.input.value === 'object'
      ? props.input.value
      : {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: props.input.value || ' ',
                },
              ],
            },
          ],
        }
  console.log(`FieldEditor:`, { content })
  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new LinkExtension({ autoLink: true, findAutoLinks, isValidUrl }),
      new BulletListExtension(),
      new OrderedListExtension(),
      new MentionExtension({
        extraAttributes: { type: 'user' },
        matchers: [{ name: 'at', char: '@', appendText: ' ', matchOffset: 1 }],
      }),
      new TaskListExtension(),
      new HeadingExtension(),
    ],
    content,
    selection: 'start',
  })

  const StyledEditorContent = styled.div<any>`
    font-family: 'Times', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
    background: 'red';
  `

  return (
    <div>
      <Remirror manager={manager} initialContent={state}>
        <Menu />
        <Box
          sx={{
            my: 2,
          }}
        >
          <AllStyledComponent>
            <ThemeProvider theme={{}}>
              <EditorComponent
                onError={(e: Error) => console.log(`FieldEditor:`, e)}
                as={StyledEditorContent}
                placeholder={'Add your content here'}
                {...input}
                style={{
                  border: '2px solid',
                  borderRadius: 2,
                  px: 2,
                }}
              />
            </ThemeProvider>
          </AllStyledComponent>
        </Box>
        <UserSuggestor allUsers={allUsers} />

        <OnChangeJSON
          onChange={(e) => {
            console.log({ e })
            input.onChange(e)
          }}
        />
      </Remirror>
    </div>
  )
}
