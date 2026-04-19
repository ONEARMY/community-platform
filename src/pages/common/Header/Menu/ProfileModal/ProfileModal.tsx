import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import { ReturnPathLink } from 'oa-components';
import { NavLink } from 'react-router';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { UpgradeBadgeLink } from 'src/pages/common/Header/Menu/Profile/UpgradeBadgeLink';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Box, Flex, useThemeUI } from 'theme-ui';

const ModalContainer = styled(Box)`
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  right: 10px;
  top: 60px;
  z-index: ${(props) => props.theme.zIndex.modalProfile};
  height: 100%;
`;

const ModalLink = styled(NavLink)`
  z-index: ${(props) => props.theme.zIndex.modalProfile};
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.colors.black};
  padding: 10px 30px 10px 30px;
  text-align: left;
  width: 100%;
  max-width: 100%;
  max-height: 100%;

  &:hover,
  &:focus,
  &:active,
  &.current {
    background-color: ${(props) => props.theme.colors.background};
  }
`;

export const ProfileModal = observer(() => {
  const { profile: activeUser, upgradeBadgeForCurrentUser } = useProfileStore();
  const { theme } = useThemeUI();

  const upgradeBadge = upgradeBadgeForCurrentUser;
  const shouldShowUpgrade = !!upgradeBadge;

  return (
    <ModalContainer data-cy="user-menu-list">
      <Flex
        sx={{
          zIndex: (theme as any).zIndex.modalProfile,
          position: 'relative',
          background: 'white',
          border: '2px solid black',
          borderRadius: 1,
          overflow: 'hidden',
          flexDirection: 'column',
        }}
      >
        <ModalLink
          to={activeUser?.username ? '/u/' + activeUser.username : '/settings/profile'}
          data-cy="menu-Profile"
          className={({ isActive }) => (isActive ? 'current' : '')}
        >
          Profile
        </ModalLink>
        {shouldShowUpgrade && (
          <UpgradeBadgeLink
            upgradeBadge={upgradeBadge}
            data-cy="menu-upgrade-badge"
            sx={{
              padding: '10px 30px 10px 30px',
              textAlign: 'left',
              '&:hover': {
                backgroundColor: 'background',
              },
            }}
          />
        )}
        <AuthWrapper>
          <ModalLink
            to="/settings"
            data-cy="menu-Settings"
            className={({ isActive }) => (isActive ? 'current' : '')}
          >
            Settings
          </ModalLink>
        </AuthWrapper>
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
