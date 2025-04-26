import { visitorPolicyLabels } from 'oa-shared'
import { Flex, Text } from 'theme-ui'

import type { IProfileTag, UserVisitorPreference } from 'oa-shared'
import type { ComponentProps } from 'react'
import type { ThemeUIStyleObject } from 'theme-ui'

type Sizing = {
  large?: boolean
}

export type IProps = {
  tags: IProfileTag[] | null
  openToVisitors?: UserVisitorPreference
  showVisitorModal?: () => void
  sx?: ThemeUIStyleObject
} & Sizing

const DEFAULT_COLOR = '#999999'

type TagProps = ComponentProps<typeof Text> &
  Sizing & {
    label: string
    color?: string
  }

const Tag = ({ label, color, large, onClick }: TagProps) => {
  const sizing = large
    ? {
        fontSize: '14px',
        paddingX: '15px',
        paddingY: '10px',
      }
    : {
        fontSize: 1,
        paddingX: '7.5px',
        paddingY: '5px',
      }
  return (
    <Text
      sx={{
        borderRadius: 99,
        border: '1px solid',
        borderColor: color,
        backgroundColor: `${color}20`,
        color: color,
        ...sizing,
        ...(onClick ? {} : { paddingTop: '12px' }),
        ':hover': onClick
          ? {
              cursor: 'pointer',
            }
          : {},
      }}
      onClick={onClick}
    >
      {label}
    </Text>
  )
}

const policyColors = new Map([
  ['open', '#116503'],
  ['appointment', '#005471'],
  ['closed', DEFAULT_COLOR],
])

export const ProfileTagsList = (props: IProps) => {
  const { tags, openToVisitors, showVisitorModal, sx, large } = props
  const tagList = tags || []

  const showVisitorDetails = () => {
    if (showVisitorModal) {
      showVisitorModal()
    }
  }

  return (
    <Flex data-cy="ProfileTagsList" sx={{ gap: 1, flexWrap: 'wrap', ...sx }}>
      {tagList.map(({ label, color }, index) => (
        <Tag
          key={index}
          color={color || DEFAULT_COLOR}
          label={label}
          large={large}
        />
      ))}
      {openToVisitors && (
        <Tag
          color={policyColors.get(openToVisitors.policy)}
          label={`${visitorPolicyLabels.get(openToVisitors.policy)} \u24D8`}
          onClick={showVisitorDetails}
          large={true}
        />
      )}
    </Flex>
  )
}
