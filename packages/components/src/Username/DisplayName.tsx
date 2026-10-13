import { ClassNames } from '@emotion/react';
import { countryToAlpha2 } from 'country-to-iso';
import type { Author } from 'oa-shared';
import type { HTMLAttributeAnchorTarget } from 'react';
import { Link } from 'react-router';
import type { ThemeUIStyleObject } from 'theme-ui';
import { css, Flex, Text, useThemeUI } from 'theme-ui';
import { FlagIcon } from '../FlagIcon/FlagIcon';
import { UserBadge } from './UserBadge';

export interface DisplayNameProps {
  user: Partial<Author>;
  sx?: ThemeUIStyleObject;
  isLink?: boolean;
  target?: HTMLAttributeAnchorTarget;
}

export const DisplayName = ({ user, sx, target, isLink = true }: DisplayNameProps) => {
  const { theme } = useThemeUI();
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
            <FlagIcon countryCode={countryCode} />
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
    <ClassNames>
      {({ css: emotionCss, cx }) => (
        <Link
          to={`/u/${username}`}
          target={target || '_self'}
          className={cx(
            '-ml-1 inline-flex min-w-0 overflow-hidden rounded-s border border-transparent px-1 text-sm text-legacy-ink transition-all duration-75 hover:border-highlight hover:bg-softblue focus:border-highlight focus:bg-softblue focus:text-bluetag focus:outline-none',
            emotionCss(css(sx || {})(theme)),
          )}
        >
          {DisplayNameBody}
        </Link>
      )}
    </ClassNames>
  );
};
