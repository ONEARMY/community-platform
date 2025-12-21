import { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { MemberBadge } from 'oa-components';
import MenuMobileLink from 'src/pages/common/Header/Menu/MenuMobile/MenuMobileLink';
import { ProfileModal } from 'src/pages/common/Header/Menu/ProfileModal/ProfileModal';
import { UpgradeBadgeLink } from './UpgradeBadgeLink';
import { MobileMenuContext } from 'src/pages/common/Header/MobileMenuContext';
import { COMMUNITY_PAGES_PROFILE } from 'src/pages/PageList';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Avatar, Box, Flex } from 'theme-ui';

import ProfileButtons from './ProfileButtons';

import './profile.css';

interface IProps {
  isMobile: boolean;
}

const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);

  return ref;
};

const Profile = observer((props: IProps) => {
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const { profile: profile, upgradeBadgeForCurrentUser } = useProfileStore();
  const modalRef = useClickOutside(() => setShowProfileModal(false));
  const mobileMenuContext = useContext(MobileMenuContext);

  if (!profile) {
    return <ProfileButtons isMobile={props.isMobile} />;
  }

  if (props.isMobile) {
    return (
      <Box
        sx={{
          borderBottom: 'none',
          borderColor: 'lightgrey',
          borderTop: '1px solid',
          mt: 1,
        }}
      >
        <MenuMobileLink path={'/u/' + profile.username} content="Profile" />
        {upgradeBadgeForCurrentUser && (
          <Box data-cy="mobile-menu-item">
            <UpgradeBadgeLink
              upgradeBadge={upgradeBadgeForCurrentUser}
              onClick={() => mobileMenuContext.setIsVisible(false)}
              data-cy="mobile-menu-upgrade-badge"
              sx={{
                justifyContent: 'center',
                fontSize: 2,
                '&:hover': {
                  opacity: 0.7,
                },
              }}
            />
          </Box>
        )}
        {COMMUNITY_PAGES_PROFILE.map((page) => (
          <MenuMobileLink path={page.path} key={page.path} content={page.title} />
        ))}
        <MenuMobileLink path="/logout" content="Log out" />
      </Box>
    );
  }

  return (
    <Box data-cy="user-menu" sx={{ width: '93px' }}>
      <Flex onClick={() => setShowProfileModal((x) => !x)} sx={{ ml: 1, height: '100%' }}>
        {profile.photo ? (
          <Avatar
            data-cy="header-avatar"
            loading="lazy"
            src={profile.photo.publicUrl}
            sx={{
              objectFit: 'cover',
              width: '40px',
              height: '40px',
            }}
          />
        ) : (
          <MemberBadge profileType={profile.type || undefined} sx={{ cursor: 'pointer' }} />
        )}
      </Flex>
      <Flex>
        {showProfileModal && (
          <div ref={modalRef}>
            <ProfileModal />
          </div>
        )}
      </Flex>
    </Box>
  );
});

export default Profile;
