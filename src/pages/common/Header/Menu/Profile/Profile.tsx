import { observer } from 'mobx-react';
import { MemberBadge } from 'oa-components';
import { useState } from 'react';
import { useClickOutside } from 'src/common/hooks/useClickOutside';
import { ProfileModal } from 'src/pages/common/Header/Menu/ProfileModal/ProfileModal';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Avatar, Box, Flex } from 'theme-ui';
import ProfileButtons from './ProfileButtons';
import './profile.css';

const Profile = observer(() => {
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const { profile } = useProfileStore();
  const modalRef = useClickOutside(() => setShowProfileModal(false));

  if (!profile) {
    return <ProfileButtons />;
  }

  return (
    <Box data-cy="user-menu" ref={modalRef} sx={{ position: 'relative' }}>
      <Flex onClick={() => setShowProfileModal((x) => !x)} sx={{ cursor: 'pointer' }}>
        {profile.photo ? (
          <Avatar
            data-cy="header-avatar"
            loading="lazy"
            src={profile.photo.publicUrl}
            sx={{ objectFit: 'cover', width: '32px', height: '32px' }}
          />
        ) : (
          <MemberBadge
            profileType={profile.type || undefined}
            size={32}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Flex>
      {showProfileModal && <ProfileModal />}
    </Box>
  );
});

export default Profile;
