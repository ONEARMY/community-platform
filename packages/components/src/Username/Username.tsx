import { countryToAlpha2 } from 'country-to-iso'
import { Flex, Text } from 'theme-ui'

import flagUnknownSVG from '../../assets/icons/flag-unknown.svg'
import { FlagIcon } from '../FlagIcon/FlagIcon'
import { InternalLink } from '../InternalLink/InternalLink'
import { UserBadge } from './UserBadge'

import type { Author } from 'oa-shared'
import type { HTMLAttributeAnchorTarget } from 'react'
import type { ThemeUIStyleObject } from 'theme-ui'

export interface IProps {
  user: Author
  sx?: ThemeUIStyleObject
  isLink?: boolean
  target?: HTMLAttributeAnchorTarget
}

const getCountryCode = (country: string | undefined) => {
  if (!country) {
    return null
  }
  return countryToAlpha2(country)
}

export const Username = ({ user, sx, target, isLink = true }: IProps) => {
  const { username, badges } = user

  const countryCode = user.country ? getCountryCode(user.country) : null

  const UserNameBody = (
    <Flex
      data-cy="Username"
      sx={{ fontFamily: 'body', gap: 1, alignItems: 'center' }}
    >
      {countryCode ? (
        <Flex data-testid="Username: known flag">
          <FlagIcon countryCode={countryCode} />
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

      <Text
        sx={{
          color: 'black',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
        title={username}
      >
        {username}
      </Text>
      {badges?.map((x) => (
        <UserBadge key={x.id} badge={x} />
      ))}
    </Flex>
  )

  if (!isLink) {
    return UserNameBody
  }

  return (
    <InternalLink
      to={`/u/${username}`}
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
