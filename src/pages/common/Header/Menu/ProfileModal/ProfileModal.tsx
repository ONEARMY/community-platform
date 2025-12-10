import { NavLink } from 'react-router';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import { ReturnPathLink } from 'oa-components';
import { preciousPlasticTheme } from 'oa-themes';
import { trackEvent } from 'src/common/Analytics';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Box, Flex, Image } from 'theme-ui';

// TODO: Remove direct usage of Theme
const theme = preciousPlasticTheme.styles;

const ModalContainer = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  right: 10px;
  top: 60px;
  z-index: ${theme.zIndex.modalProfile};
  height: 100%;
`;

const ModalLink = styled(NavLink)`
  z-index: ${theme.zIndex.modalProfile};
  display: flex;
  flex-direction: column;
  color: ${theme.colors.black};
  padding: 10px 30px 10px 30px;
  text-align: left;
  width: 100%;
  max-width: 100%;
  max-height: 100%;

  &:hover,
  &:focus,
  &:active,
  &.current {
    background-color: ${theme.colors.background};
  }
`;

export const ProfileModal = observer(() => {
  const { profile: activeUser, getUpgradeBadgeForCurrentUser } = useProfileStore();

  const upgradeBadge = getUpgradeBadgeForCurrentUser();
  const shouldShowUpgrade = !!upgradeBadge;

  return (
    <ModalContainer data-cy="user-menu-list">
      <Flex
        sx={{
          zIndex: theme.zIndex.modalProfile,
          position: 'relative',
          background: 'white',
          border: '2px solid black',
          borderRadius: 1,
          overflow: 'hidden',
          flexDirection: 'column',
        }}
      >
        <ModalLink
          to={'/u/' + activeUser?.username}
          data-cy="menu-Profile"
          className={({ isActive }) => (isActive ? 'current' : '')}
        >
          Profile
        </ModalLink>
        {shouldShowUpgrade && (
          <Box
            as="a"
            // @ts-expect-error - Box doesn't properly type 'as' prop with anchor attributes
            href={upgradeBadge.actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cy="menu-upgrade-badge"
            onClick={() => {
              trackEvent({
                category: 'profiles',
                action: 'upgradeBadgeClicked',
                label: upgradeBadge.actionLabel,
              });
            }}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 1,
              color: 'black',
              padding: '10px 30px 10px 30px',
              textAlign: 'left',
              textDecoration: 'none',
              width: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              '&:hover': {
                backgroundColor: 'background',
              },
            }}
          >
            {upgradeBadge.actionLabel}
            {upgradeBadge.badge?.imageUrl && (
              <Image
                src={upgradeBadge.badge.imageUrl}
                sx={{ height: 20, width: 20 }}
                alt={upgradeBadge.badge.displayName || 'badge'}
              />
            )}
          </Box>
        )}
        {COMMUNITY_PAGES_PROFILE.map((page) => (
          <AuthWrapper key={page.path}>
            <ModalLink
              to={page.path}
              data-cy={`menu-${page.title}`}
              className={({ isActive }) => (isActive ? 'current' : '')}
            >
              {page.title}
            </ModalLink>
          </AuthWrapper>
        ))}
        <Box
          sx={{
            padding: '10px 30px 10px 30px',
            '&:hover': { background: 'background' },
          }}
        >
          <ReturnPathLink data-cy="menu-Logout" to="/logout" style={{ color: 'black' }}>
            Log out
          </ReturnPathLink>
        </Box>
      </Flex>
    </ModalContainer>
  );
});
