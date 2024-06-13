import { Card, Flex, Heading, Text } from 'theme-ui'

import type { ReactElement } from 'react'

export interface IProps {
  title: string
  steps: ReactElement[]
}

export const Guidelines = ({ title, steps }: IProps) => {
  return (
    <Card>
      <Flex sx={{ flexDirection: 'column', padding: [2, 3, 4], gap: 1 }}>
        <Heading as="h2" mb={2}>
          {title}
        </Heading>

        {steps.map((step, index) => {
          return (
            <Text variant="auxiliary" key={index}>
              {`${index + 1}. `} {step}
            </Text>
          )
        })}
      </Flex>
    </Card>
  )
}
