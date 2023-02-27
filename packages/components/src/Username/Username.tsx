import type { ThemeUIStyleObject } from 'theme-ui'
import { Text, Flex, Image } from 'theme-ui'
import VerifiedBadgeIcon from '../../assets/icons/icon-verified-badge.svg'
import { FlagIconHowTos } from '../FlagIcon/FlagIcon'
import { InternalLink } from '../InternalLink/InternalLink'
import type { User } from '../'
import { Icon } from '../'

export interface Props {
  isVerified: boolean
  user: User
  sx?: ThemeUIStyleObject
}

export const Username = (props: Props) => {
  return (
    <InternalLink
      data-cy="Username"
      to={`/u/${props.user.userName}`}
      sx={{
        border: '1px solid transparent',
        display: 'inline-flex',
        paddingX: 1,
        paddingY: '3px',
        borderRadius: 1,
        marginLeft: -1,
        color: 'black',
        fontSize: 2,
        transition: '80ms ease-out all',
        '&:focus': {
          borderColor: '#20B7EB',
          background: 'softblue',
          outline: 'none',
          color: 'bluetag',
        },
        '&:hover': {
          borderColor: '#20B7EB',
          background: 'softblue',
          color: 'bluetag',
        },
        ...(props.sx || {}),
      }}
    >
      <Flex
        sx={{
          fontFamily: 'body',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Flex mr={1} sx={{ display: 'inline-flex' }}>
          {props.user.countryCode ? (
            <FlagIconHowTos code={props.user.countryCode.toLowerCase()} />
          ) : (
            <Flex
              sx={{
                background: 'black',
                borderRadius: '3px',
                height: '14px',
                width: '21px !important',
                justifyContent: 'center',
                alignItems: 'center',
                lineHeight: 0,
              }}
            >
              <Icon glyph="star-active" size="11" />
            </Flex>
          )}
        </Flex>
        <Text>{props.user.userName}</Text>
        {props.isVerified && (
          <Image
            src={VerifiedBadgeIcon}
            sx={{ ml: 1, height: 16, width: 16 }}
            data-testid="Username: verified badge"
          />
        )}
      </Flex>
    </InternalLink>
  )
}
