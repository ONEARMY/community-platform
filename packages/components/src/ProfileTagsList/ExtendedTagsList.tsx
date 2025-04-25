import { visitorPolicyLabels } from 'oa-shared'
import { Flex, Text } from 'theme-ui'

import type { IProfileTag, UserVisitorPreference} from 'oa-shared';
import type { ComponentProps } from 'react'
import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  tags?: IProfileTag[]
  openToVisitors?: UserVisitorPreference
  sx?: ThemeUIStyleObject | undefined
}

const DEFAULT_COLOR = '#999999'

function colorStyling(color: string): ThemeUIStyleObject {
  return {
    borderColor: color,
    backgroundColor: `${color}20`,
    color: color
  }
}

type TagProps = ComponentProps<any> & {
  color?: string
}

const Tag = ({ children, color }: TagProps) => {
  return <Text
    sx={{
      borderRadius: 99,
      border: '1px solid',
      fontSize: '14px',
      paddingX: '15px',
      paddingY: '10px',
      ...colorStyling(color || DEFAULT_COLOR)
    }}
  >
    {children}
  </Text>
}

export const ExtendedTagsList = ({ tags, openToVisitors, sx }: IProps) => {
  const tagList = tags || []

  const policyColors = new Map(Object.entries({
    open: '#116503',
    appointment: '#005471',
    closed: DEFAULT_COLOR
  }))

  const policyLabels = new Map<string, string>(Object.entries(visitorPolicyLabels))

  return (
    <Flex data-cy="ProfileTagsList" sx={{ gap: 1, flexWrap: 'wrap', ...sx }}>
      {tagList.map(
        ({ label, color }, index) =>
          <Tag key={index} color={color}>{label}</Tag>
      )}
      {openToVisitors && <Tag key={tagList.length} color={policyColors.get(openToVisitors.policy)}>
        {policyLabels.get(openToVisitors.policy)}
      </Tag>}
    </Flex>
  )
}
