import { useState } from 'react'
import { Card, Flex } from 'theme-ui'

import { Button } from '../Button/Button'

import type { ReactNode } from 'react'

interface IProps {
  children: ReactNode[]
}

export const ActionSet = ({ children }: IProps) => {
  const [show, setShow] = useState<boolean>(false)

  const toDisplay = children.filter((child) => !!child)
  if (!children || toDisplay.length === 0) {
    return <></>
  }

  const onClick = () => setShow((show) => !show)

  return (
    <>
      <Flex
        sx={{
          display: 'inline-block',
          position: 'relative',
          gap: 2,
        }}
      >
        <Button
          data-cy="ActionSetButton"
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
              padding: 2,
              gap: 2,
              minWidth: '190px',
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
    </>
  )
}
