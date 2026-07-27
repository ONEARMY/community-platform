import { ClientOnly } from 'remix-utils/client-only';
import { Flex } from 'theme-ui';
import { ProfileButtonItem } from './ProfileButtonItem';

const ProfileButtons = () => {
  return (
    <ClientOnly fallback={<></>}>
      {() => (
        <Flex sx={{ alignItems: 'center', gap: '8px' }}>
          <ProfileButtonItem link="/sign-in" text="Login" variant="outline" small />
          <ProfileButtonItem link="/sign-up" text="Join" variant="outline" small />
        </Flex>
      )}
    </ClientOnly>
  );
};

export default ProfileButtons;
