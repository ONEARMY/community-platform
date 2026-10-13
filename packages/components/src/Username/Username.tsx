import { ClassNames } from '@emotion/react';
import { countryToAlpha2 } from 'country-to-iso';
import type { Author } from 'oa-shared';
import type { HTMLAttributeAnchorTarget } from 'react';
import { Link } from 'react-router';
import type { ThemeUIStyleObject } from 'theme-ui';
import { css, Flex, Text, useThemeUI } from 'theme-ui';
import flagUnknownSVG from '../../assets/icons/flag-unknown.svg';
import { FlagIcon } from '../FlagIcon/FlagIcon';
import { UserBadge } from './UserBadge';

export interface IProps {
  user: Partial<Author>;
  sx?: ThemeUIStyleObject;
  isLink?: boolean;
  target?: HTMLAttributeAnchorTarget;
}

const getCountryCode = (country: string | undefined) => {
  if (!country) {
    return null;
  }
  return countryToAlpha2(country);
};

export const Username = (props: IProps) => {
  const { theme } = useThemeUI();
  const { user, sx = {}, target = '_self', isLink = true } = props;
  const { username, badges } = user;

  if (!username) {
    return null;
  }

  const countryCode = user.country ? getCountryCode(user.country) : null;

  const UserNameBody = (
    <Flex
      data-cy="Username"
      sx={{ fontFamily: 'body', gap: 1, alignItems: 'center', minWidth: 0, paddingX: 1 }}
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

      {badges && badges.length > 0 && (
        <Flex sx={{ gap: 1, alignItems: 'center' }}>
          {badges.map((badge) => {
            return <UserBadge key={badge.id} badge={badge} />;
          })}
        </Flex>
      )}
    </Flex>
  );

  if (!isLink) {
    return UserNameBody;
  }

  return (
    <ClassNames>
      {({ css: emotionCss, cx }) => (
        <Link
          to={`/u/${username}`}
          target={target}
          className={cx(
            '-ml-1 inline-flex min-w-0 max-w-full rounded-s border border-transparent py-0.5 text-sm text-legacy-ink transition-all duration-75 hover:border-highlight hover:bg-softblue focus:border-highlight focus:bg-softblue focus:text-bluetag focus:outline-none',
            emotionCss(css(sx)(theme)),
          )}
        >
          {UserNameBody}
        </Link>
      )}
    </ClassNames>
  );
};
