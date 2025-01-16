import { useState } from 'react'
import { Flex, Heading, Text, ThemeUIStyleObject } from 'theme-ui'
import { Icon } from '../Icon/Icon'

export interface IProps {
  children: React.ReactNode
  sx?: ThemeUIStyleObject | undefined
  title: string
  subtitle?: string
}

export const Accordion = (props: IProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const { children, sx, title, subtitle } = props

  return (
    <Flex
      data-cy="AccordionContainer"
      sx={{ flexDirection: 'column', gap: 2, ...sx }}
    >
      <Flex
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Heading as="h3" variant="small">
          {title}
        </Heading>
        <Icon glyph={isExpanded ? 'arrow-full-up' : 'arrow-full-down'} />
      </Flex>

      {subtitle != undefined && (
        <Text sx={{ fontSize: 1, color: 'gray' }}>{subtitle}</Text>
      )}
      {isExpanded && children}
    </Flex>
  )
}
