import { countryToAlpha2 } from 'country-to-iso';
import type { Author } from 'oa-shared';
import type { HTMLAttributeAnchorTarget } from 'react';
import { ReactCountryFlag } from 'react-country-flag';
import { Link } from 'react-router';
import { Flex, Text } from 'theme-ui';
import { UserBadge } from './UserBadge';

export interface DisplayNameProps {
  user: Partial<Author>;
  className?: string;
  isLink?: boolean;
  target?: HTMLAttributeAnchorTarget;
}

export const DisplayName = ({ user, className, target, isLink = true }: DisplayNameProps) => {
  const { username, displayName, country, badges } = user;
  const countryCode = country ? countryToAlpha2(country) : null;

  const DisplayNameBody = (
    <Flex
      data-cy="DisplayName"
      sx={{
        fontFamily: 'title',
        gap: 1,
        alignItems: 'start',
        minWidth: 0,
        flexDirection: 'row',
        paddingY: '3px',
      }}
    >
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ gap: 1, alignItems: 'center' }}>
          <Text
            sx={{
              color: 'black',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            title={displayName || username || ''}
          >
            {displayName || username}
          </Text>

          {badges && badges.length > 0 && (
            <Flex sx={{ gap: 1, alignItems: 'center' }}>
              {badges.map((badge) => {
                return <UserBadge key={badge.id} badge={badge} />;
              })}
            </Flex>
          )}
        </Flex>
        {countryCode && (
          <Flex sx={{ alignItems: 'center', gap: 1, pt: 1 }}>
            <ReactCountryFlag
              data-cy={`country:${countryCode}`}
              countryCode={countryCode}
              title={countryCode}
              svg={true}
              style={{
                borderRadius: '3px',
                backgroundSize: 'cover',
                width: '21px',
                height: '14px',
              }}
            />
            <Text
              sx={{
                color: 'grey',
                fontSize: 1,
                fontFamily: 'body',
                lineHeight: '100%',
              }}
            >
              {country}
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );

  if (!isLink || !username) {
    return DisplayNameBody;
  }

  return (
    <Link
      to={`/u/${username}`}
      target={target || '_self'}
      className={`-ml-1 inline-flex min-w-0 overflow-hidden rounded-card-flat border border-transparent px-1 text-sm text-foreground transition-all duration-80 ease-out hover:border-highlight hover:bg-softblue focus:border-highlight focus:bg-softblue focus:outline-none ${className ?? ''}`}
    >
      {DisplayNameBody}
    </Link>
  );
};
