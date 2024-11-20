import { Flex, Image, Text } from 'theme-ui'

import flagUnknownSVG from '../../assets/icons/flag-unknown.svg'
import VerifiedBadgeIcon from '../../assets/icons/icon-verified-badge.svg'
import SupporterBadgeIcon from '../../assets/icons/supporter.svg'
import { FlagIconHowTos } from '../FlagIcon/FlagIcon'
import { InternalLink } from '../InternalLink/InternalLink'
import { twoCharacterCountryCodes } from './TwoCharacterCountryCodes'

import type { HTMLAttributeAnchorTarget } from 'react'
import type { ThemeUIStyleObject } from 'theme-ui'
import type { User } from '../types/common'

export interface IProps {
  user: User
  sx?: ThemeUIStyleObject
  isLink?: boolean
  target?: HTMLAttributeAnchorTarget
}

const isValidCountryCode = (str: string) =>
  str && twoCharacterCountryCodes.has(str.toUpperCase())

export const Username = ({ user, sx, target, isLink = true }: IProps) => {
  const { countryCode, userName, isSupporter, isVerified } = user

  const UserNameBody = (
    <Flex
      data-cy="Username"
      sx={{
        fontFamily: 'body',
        alignItems: 'center',
      }}
    >
      <Flex mr={1}>
        {countryCode && isValidCountryCode(countryCode) ? (
          <Flex data-testid="Username: known flag">
            <FlagIconHowTos
              countryCode={countryCode}
              svg={true}
              title={countryCode}
              data-cy={`country:${countryCode}`}
            />
          </Flex>
        ) : (
          <Flex
            data-testid="Username: unknown flag"
            sx={{
              backgroundImage: `url("${flagUnknownSVG}")`,
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

      <Text sx={{ color: 'black' }}>{userName}</Text>
      {isVerified && (
        <Image
          src={VerifiedBadgeIcon}
          sx={{ ml: 1, height: 16, width: 16 }}
          data-testid="Username: verified badge"
        />
      )}
      {isSupporter && !isVerified && (
        <Image
          src={SupporterBadgeIcon}
          sx={{ ml: 1, height: 16, width: 16 }}
          data-testid="Username: supporter badge"
        />
      )}
    </Flex>
  )

  if (!isLink) {
    return UserNameBody
  }

  return (
    <InternalLink
      to={`/u/${userName}`}
      target={target || '_self'}
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
          textcolor: 'bluetag',
        },
        ...(sx || {}),
      }}
    >
      {UserNameBody}
    </InternalLink>
  )
}
