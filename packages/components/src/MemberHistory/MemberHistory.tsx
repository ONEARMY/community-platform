import { formatDistanceToNow } from 'date-fns'
import { Divider, Flex, Text } from 'theme-ui'

export interface MemberHistoryProps {
  memberSince: string | undefined
  lastActive: string | undefined
}

export const MemberHistory = (props: MemberHistoryProps) => {
  const memberSince = new Date(props?.memberSince || '0').getFullYear()
  const lastActive = formatDistanceToNow(new Date(props?.lastActive || 0), {
    addSuffix: true,
  })

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
      <Text variant="quiet" sx={{ fontSize: 1 }}>
        Member since {memberSince}
      </Text>
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
      <Text variant="quiet" sx={{ fontSize: 1 }}>
        Last active {lastActive}
      </Text>
    </Flex>
  )
}
