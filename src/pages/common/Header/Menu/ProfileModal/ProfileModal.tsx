import styled from '@emotion/styled';
import { countries, getEmojiFlag } from 'countries-list';
import { countryToAlpha2 } from 'country-to-iso';
import { observer } from 'mobx-react';
import { Icon, MemberBadge, ReturnPathLink } from 'oa-components';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Avatar, Box, Flex, Text } from 'theme-ui';

const rowStyles = `
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 8px 4px;
  border-radius: 4px;
  font-size: 14px;
  letter-spacing: 0.28px;
  color: #000;
  text-decoration: none;
  cursor: pointer;
  &:hover,
  &.active {
    background: #f4f6f7;
  }
`;

const RowLink = styled(NavLink)`
  font-family: ${(props) => (props.theme as any).fonts.nav};
  ${rowStyles}
`;

const RowReturnLink = styled(ReturnPathLink)`
  font-family: ${(props) => (props.theme as any).fonts.nav};
  ${rowStyles}
  opacity: 0.55;
`;

type ProfileGlyph = 'nav-profile' | 'nav-settings' | 'nav-supporter' | 'nav-logout';

const RowContent = ({ icon, children }: { icon: ProfileGlyph; children: ReactNode }) => (
  <>
    <Icon glyph={icon} size={22} />
    <span>{children}</span>
  </>
);

export const ProfileModal = observer(() => {
  const { profile } = useProfileStore();
  const profilePath = profile?.username ? '/u/' + profile.username : '/settings/profile';

  const country = profile?.country?.trim();
  const rawCountry =
    country && !['null', 'undefined'].includes(country.toLowerCase()) ? country : null;
  const iso2 = rawCountry
    ? rawCountry.length === 2
      ? rawCountry.toUpperCase()
      : countryToAlpha2(rawCountry)
    : null;
  const countryData = iso2 ? countries[iso2 as keyof typeof countries] : undefined;
  const countryName = countryData?.name || rawCountry;
  const flagEmoji = countryData ? getEmojiFlag(iso2 as keyof typeof countries) : '';

  return (
    <Box
      data-cy="user-menu-list"
      sx={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        zIndex: 900,
        minWidth: '237px',
        maxWidth: 'calc(100vw - 16px)',
        bg: 'white',
        borderRadius: '8px',
        border: '1px solid rgba(0, 0, 0, 0.19)',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.16)',
        p: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <Flex sx={{ gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ minWidth: 0 }}>
          {profile?.displayName && (
            <Text
              sx={{
                fontFamily: 'nav',
                fontSize: '15px',
                fontWeight: 'bold',
                letterSpacing: '0.3px',
                lineHeight: 1.2,
                color: '#000',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {profile.displayName}
            </Text>
          )}
          {rawCountry && (
            <Text
              sx={{
                fontFamily: 'nav',
                fontSize: '12px',
                letterSpacing: '0.24px',
                lineHeight: 1.2,
                color: 'rgba(0, 0, 0, 0.7)',
                whiteSpace: 'nowrap',
              }}
            >
              {flagEmoji ? `${flagEmoji} ` : ''}
              {countryName}
            </Text>
          )}
        </Box>
        {profile?.photo ? (
          <Avatar
            src={profile.photo.publicUrl}
            loading="lazy"
            sx={{ width: '32px', height: '32px', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <MemberBadge profileType={profile?.type || undefined} size={32} useLowDetailVersion />
        )}
      </Flex>

      <Flex sx={{ flexDirection: 'column', gap: '16px' }}>
        <RowLink to={profilePath} data-cy="menu-Profile">
          <RowContent icon="nav-profile">Profile</RowContent>
        </RowLink>
        <AuthWrapper>
          <RowLink to="/settings" data-cy="menu-Settings">
            <RowContent icon="nav-settings">Settings</RowContent>
          </RowLink>
        </AuthWrapper>
        <RowLink to="/supporter" data-cy="menu-Supporter">
          <RowContent icon="nav-supporter">Become a supporter</RowContent>
        </RowLink>
        <RowReturnLink to="/logout" data-cy="menu-Logout">
          <RowContent icon="nav-logout">Log out</RowContent>
        </RowReturnLink>
      </Flex>
    </Box>
  );
});
