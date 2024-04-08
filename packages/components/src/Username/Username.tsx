import { Flex, Image, Text } from 'theme-ui'

import flagUnknownSVG from '../../assets/icons/flag-unknown.svg'
import VerifiedBadgeIcon from '../../assets/icons/icon-verified-badge.svg'
import SupporterBadgeIcon from '../../assets/icons/supporter.svg'
import { FlagIconHowTos } from '../FlagIcon/FlagIcon'
import { InternalLink } from '../InternalLink/InternalLink'
import { twoCharacterCountryCodes } from './TwoCharacterCountryCodes'

import type { ThemeUIStyleObject } from 'theme-ui'
import type { User } from '../'

export interface Props {
  isVerified: boolean
  isSupporter: boolean
  user: User
  sx?: ThemeUIStyleObject
}

const isValidCountryCode = (str: string) =>
  str && twoCharacterCountryCodes.has(str.toUpperCase())

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
          {props.user.countryCode &&
          isValidCountryCode(props.user.countryCode) ? (
            <Flex data-testid="Username: known flag">
              <FlagIconHowTos code={props.user.countryCode.toLowerCase()} />
            </Flex>
          ) : (
            <Flex
              data-testid="Username: unknown flag"
              sx={{
                backgroundImage: `url(${flagUnknownSVG})`,
                backgroundSize: 'cover',
                borderRadius: '3px',
                height: '14px',
                width: '21px !important',
                justifyContent: 'center',
                alignItems: 'center',
                lineHeight: 0,
                overflow: 'hidden',
              }}
            ></Flex>
          )}
        </Flex>
        <Text>{props.user.userName}</Text>
        {(props.isVerified || (props.isVerified && props.isSupporter)) && (
          <Image
            src={VerifiedBadgeIcon}
            sx={{ ml: 1, height: 16, width: 16 }}
            data-testid="Username: verified badge"
          />
        )}
        {props.isSupporter && !props.isVerified && (
          <Image
            src={SupporterBadgeIcon}
            sx={{ ml: 1, height: 16, width: 16 }}
            data-testid="Username: supporter badge"
          />
        )}
      </Flex>
    </InternalLink>
  )
}
