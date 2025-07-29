import { useState } from 'react'
import { Card, Flex } from 'theme-ui'

import { Button } from '../Button/Button'

import type { ReactNode } from 'react'

interface IProps {
  children: ReactNode[]
  itemType: 'ReplyItem' | 'CommentItem'
}

export const ActionSet = ({ children, itemType }: IProps) => {
  const [show, setShow] = useState<boolean>(false)

  const toDisplay = children.filter((child) => !!child)
  if (!children || toDisplay.length === 0) {
    return <></>
  }

  const onClick = () => setShow((show) => !show)

  return (
    <Flex
      sx={{
        display: 'inline-block',
        position: 'relative',
        gap: 2,
      }}
    >
      <Button
        data-cy={`${itemType}: ActionSetButton`}
        icon="more-vert"
        onClick={onClick}
        variant="subtle"
        showIconOnly
      >
        Show Actions
      </Button>

      {show && (
        <Card
          sx={{
            position: 'absolute',
            right: 0,
            zIndex: 1,
            padding: 1,
            gap: 1,
            minWidth: '200px',
          }}
        >
          <Flex
            sx={{
              alignItems: 'stretch',
              justifyItems: 'stretch',
              flexDirection: 'column',
            }}
          >
            {...children}
          </Flex>
        </Card>
      )}
    </Flex>
  )
}
