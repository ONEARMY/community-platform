import type { Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { countries } from 'countries-list';
import { countryToAlpha2 } from 'country-to-iso';
import { observer } from 'mobx-react';
import { FlagIcon, Icon, MemberBadge, ReturnPathLink } from 'oa-components';
import { theme } from 'oa-themes';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Avatar, Box, Flex, Text } from 'theme-ui';

const rowStyles = ({ theme }: { theme: Theme }) => `
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 8px 4px;
  border-radius: 4px;
  font-size: 14px;
  letter-spacing: 0.02em;
  color: ${theme.colors.black};
  text-decoration: none;
  cursor: pointer;
  &:hover,
  &.active {
    background: ${theme.colors.background};
  }
`;

const RowLink = styled(NavLink)`
  font-family: ${({ theme }) => theme.fonts.nav};
  ${rowStyles}
`;

const RowReturnLink = styled(ReturnPathLink)`
  font-family: ${({ theme }) => theme.fonts.nav};
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
  const { profile, upgradeBadgeForCurrentUser } = useProfileStore();
  const profilePath = profile?.username ? '/u/' + profile.username : '/settings/profile';

  const rawCountry = profile?.country?.trim() || null;
  const iso2 = rawCountry ? countryToAlpha2(rawCountry) : null;
  const countryData = iso2 ? countries[iso2 as keyof typeof countries] : undefined;
  const countryName = countryData?.name || rawCountry;

  return (
    <Box
      data-cy="user-menu-list"
      sx={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: 0,
        zIndex: theme.zIndex.modalProfile,
        minWidth: '237px',
        maxWidth: 'calc(100vw - 16px)',
        bg: 'white',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'popoverBorder',
        boxShadow: 'popover',
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
                letterSpacing: '0.02em',
                lineHeight: 1.2,
                color: 'black',
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
            <Flex sx={{ alignItems: 'center', gap: '6px' }}>
              {iso2 && countryData && <FlagIcon countryCode={iso2} />}
              <Text
                sx={{
                  fontFamily: 'nav',
                  fontSize: '12px',
                  letterSpacing: '0.02em',
                  lineHeight: 1.2,
                  color: 'rgba(0, 0, 0, 0.7)',
                  whiteSpace: 'nowrap',
                }}
              >
                {countryName}
              </Text>
            </Flex>
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
        {upgradeBadgeForCurrentUser && (
          <RowLink to="/supporter" data-cy="menu-Supporter">
            <RowContent icon="nav-supporter">Become a supporter</RowContent>
          </RowLink>
        )}
        <RowReturnLink to="/logout" data-cy="menu-Logout">
          <RowContent icon="nav-logout">Log out</RowContent>
        </RowReturnLink>
      </Flex>
    </Box>
  );
});
