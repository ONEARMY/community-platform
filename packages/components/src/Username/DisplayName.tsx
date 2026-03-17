import type { Author } from 'oa-shared';
import type { HTMLAttributeAnchorTarget } from 'react';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Flex, Text } from 'theme-ui';
import { InternalLink } from '../InternalLink/InternalLink';
import { UserBadge } from './UserBadge';

export interface DisplayNameProps {
  user: Partial<Author>;
  sx?: ThemeUIStyleObject;
  isLink?: boolean;
  target?: HTMLAttributeAnchorTarget;
}

export const DisplayName = ({ user, sx, target, isLink = true }: DisplayNameProps) => {
  const { username, displayName, country, badges } = user;

  const DisplayNameBody = (
    <Flex
      data-cy="DisplayName"
      sx={{ fontFamily: 'body', gap: 1, alignItems: 'center', minWidth: 0 }}
    >
      <Text
        sx={{
          color: 'black',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
        title={displayName || username || undefined}
      >
        {displayName || username}
      </Text>

      {badges &&
        badges.map((badge) => {
          return <UserBadge key={badge.id} badge={badge} />;
        })}

      {country && (
        <Text
          sx={{
            color: 'grey',
            fontSize: 1,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {country}
        </Text>
      )}
    </Flex>
  );

  if (!isLink) {
    return DisplayNameBody;
  }

  return (
    <InternalLink
      to={`/u/${username}`}
      target={target || '_self'}
      sx={{
        border: '1px solid transparent',
        display: 'inline-flex',
        minWidth: 0,
        overflow: 'hidden',
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
      {DisplayNameBody}
    </InternalLink>
  );
};
