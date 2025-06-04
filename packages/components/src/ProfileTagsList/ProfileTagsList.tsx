import { Flex, Text } from 'theme-ui'

import { visitorDisplayData } from '../VisitorModal/VisitorModal'

import type { IProfileTag, IUser } from 'oa-shared'
import type { ComponentProps } from 'react'
import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  tags: IProfileTag[] | null
  openToVisitors?: IUser['openToVisitors']
  isSpace: boolean
  showVisitorModal?: () => void
  sx?: ThemeUIStyleObject
  large?: boolean
}

const DEFAULT_COLOR = '#999999'

type TagProps = ComponentProps<typeof Text> & {
  label: string
  large: IProps['large']
  color?: string
  dataCy?: string
}

const Tag = ({ color, dataCy, label, large, onClick }: TagProps) => {
  const sizing = large
    ? {
        fontSize: 2,
        paddingX: 2,
        paddingY: '10px',
      }
    : {
        fontSize: 1,
        paddingX: '7.5px',
        paddingY: '5px',
      }
  return (
    <Text
      data-cy={dataCy}
      sx={{
        borderRadius: 99,
        border: '1px solid',
        borderColor: color,
        backgroundColor: `${color}20`,
        color: color,
        ...sizing,
        // Correction for misalignment due to \u24D8
        ...(large && !onClick ? { paddingTop: '12px' } : {}),
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
  const { tags, openToVisitors, isSpace, showVisitorModal, sx, large } = props
  const tagList = tags || []

  return (
    <Flex
      data-cy="ProfileTagsList"
      data-testid="ProfileTagsList"
      sx={{ gap: 1, flexWrap: 'wrap', ...sx }}
    >
      {tagList.map(({ label, color }, index) => (
        <Tag
          key={index}
          color={color || DEFAULT_COLOR}
          label={label}
          large={large}
        />
      ))}
      {openToVisitors && isSpace && (
        <Tag
          dataCy="tag-openToVisitors"
          color={policyColors.get(openToVisitors.policy)}
          label={`${
            visitorDisplayData.get(openToVisitors.policy)?.label
          } \u24D8`}
          onClick={() => {
            showVisitorModal && showVisitorModal()
          }}
          large={true}
        />
      )}
    </Flex>
  )
}
