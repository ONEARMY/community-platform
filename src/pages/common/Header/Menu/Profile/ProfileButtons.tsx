import { ClientOnly } from 'remix-utils/client-only';
import { Flex } from 'theme-ui';
import { ProfileButtonItem } from './ProfileButtonItem';

const ProfileButtons = () => {
  const buttonBase = {
    fontFamily: 'nav',
    fontWeight: 'normal',
    fontSize: ['12px', '12px', '14px'],
    border: '1px solid rgba(0, 0, 0, 0.16)',
    borderRadius: '4px',
    height: 'auto',
  };

  return (
    <ClientOnly fallback={<></>}>
      {() => (
        <Flex sx={{ alignItems: 'center', gap: '8px' }}>
          <ProfileButtonItem
            link="/sign-in"
            text="Login"
            variant="outline"
            sx={{
              ...buttonBase,
              color: '#111',
              backgroundColor: 'transparent',
              px: ['12px', '12px', '17px'],
              py: ['6px', '6px', '8px'],
              '&:hover': { backgroundColor: 'background' },
            }}
          />
          <ProfileButtonItem
            link="/sign-up"
            text="Join"
            variant="outline"
            sx={{
              ...buttonBase,
              color: 'black',
              backgroundColor: 'activeYellow',
              px: ['11px', '11px', '15px'],
              py: ['5px', '5px', '7px'],
              '&:hover': { backgroundColor: 'activeYellow', filter: 'brightness(97%)' },
            }}
          />
        </Flex>
      )}
    </ClientOnly>
  );
};

export default ProfileButtons;
