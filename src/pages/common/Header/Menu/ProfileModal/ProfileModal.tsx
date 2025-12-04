import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import { ReturnPathLink } from 'oa-components';
import { preciousPlasticTheme } from 'oa-themes';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { upgradeBadgeService } from 'src/services/upgradeBadgeService';
import { Box, Flex, Image } from 'theme-ui';

import type { UpgradeBadge } from 'oa-shared';

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
  const { profile: activeUser } = useProfileStore();
  const [upgradeBadges, setUpgradeBadges] = useState<UpgradeBadge[]>([]);

  useEffect(() => {
    const fetchUpgradeBadges = async () => {
      const badges = await upgradeBadgeService.getUpgradeBadges();
      setUpgradeBadges(badges);
    };
    fetchUpgradeBadges();
  }, []);

  const isSpace = activeUser?.type?.isSpace || false;
  const upgradeBadge = upgradeBadges.find((badge) => badge.isSpace === isSpace);

  const userBadgeIds = activeUser?.badges?.map((badge) => badge.id) || [];
  const hasUpgradeBadge = upgradeBadge ? userBadgeIds.includes(upgradeBadge.badgeId) : false;
  const shouldShowUpgrade = upgradeBadge && !hasUpgradeBadge;

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
            href={upgradeBadge.actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cy="menu-upgrade-badge"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
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
                sx={{ height: 16, width: 16 }}
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
