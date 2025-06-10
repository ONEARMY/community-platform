import { formatDistanceToNow, isValid } from 'date-fns'
import { Divider, Flex, Text } from 'theme-ui'

export interface IProps {
  memberSince: string | undefined
  lastActive: string | undefined
}

export const MemberHistory = (props: IProps) => {
  const memberSince = new Date(props?.memberSince || '0').getFullYear()
  const isDateFormat = isValid(new Date(props?.lastActive || 0))
  const lastActive = isDateFormat
    ? formatDistanceToNow(new Date(props?.lastActive || 0), {
        addSuffix: true,
      })
    : 0

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
      {isDateFormat && (
        <>
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
        </>
      )}
    </Flex>
  )
}
