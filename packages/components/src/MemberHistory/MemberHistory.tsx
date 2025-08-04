import { useMemo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Divider, Flex, Text } from 'theme-ui'

export interface IProps {
  memberSince: Date
  lastActive: Date | null
}

export const MemberHistory = (props: IProps) => {
  const memberSince = useMemo(() => {
    try {
      if (props.memberSince) {
        return new Date(props.memberSince).getFullYear().toString()
      }
    } catch (error) {
      console.error(error)
    }

    return null
  }, [props.memberSince])

  const lastActive = useMemo(() => {
    try {
      if (props.lastActive) {
        return formatDistanceToNow(new Date(props.lastActive), {
          addSuffix: true,
        })
      }
    } catch (error) {
      console.error(error)
    }

    return null
  }, [props.lastActive])

  return (
    <Flex
      data-cy="MemberHistory"
      sx={{
        gap: 2,
        flexDirection: ['column', 'column', 'row'],
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      {memberSince && (
        <Text variant="quiet" sx={{ fontSize: 1 }}>
          Member since {memberSince}
        </Text>
      )}
      {memberSince && lastActive && (
        <Divider
          sx={{
            display: ['none', 'none', 'block'],
            width: '1px',
            height: 'auto',
            alignSelf: 'stretch',
            border: '2px solid #0000001A',
            m: 0,
          }}
        />
      )}
      {lastActive && (
        <Text variant="quiet" sx={{ fontSize: 1 }}>
          Last active {lastActive}
        </Text>
      )}
    </Flex>
  )
}
