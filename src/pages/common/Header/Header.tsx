import { observer } from 'mobx-react';
import type { NotificationDisplay } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { AuthWrapper } from 'src/common/AuthWrapper';
import Logo from 'src/pages/common/Header/Menu/Logo/Logo';
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop';
import MobileBottomNav from 'src/pages/common/Header/Menu/MobileBottomNav';
import Profile from 'src/pages/common/Header/Menu/Profile/Profile';
import { notificationSupabaseService } from 'src/services/notificationsSupabaseService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex, Text, useThemeUI } from 'theme-ui';
import { NotificationsContext } from '../NotificationsContext';
import { NotificationsSupabase } from './Menu/Notifications/NotificationsSupabase';

const HIDDEN_PATHS = ['/supporter'];

const Header = observer(() => {
  const { theme } = useThemeUI();
  const { profile } = useProfileStore();
  const isLoggedIn = !!profile;
  const location = useLocation();

  const showHeader = useMemo(() => {
    const path = location?.pathname;
    return !HIDDEN_PATHS.some((p) => path.startsWith(p));
  }, [location?.pathname]);

  // New notifications states
  const [notificationsSupabase, setNotificationsSupabase] = useState<NotificationDisplay[] | null>(
    null,
  );
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState<boolean>(true);

  const updateNotifications = async () => {
    setIsUpdatingNotifications(true);
    const notifications = await notificationSupabaseService.getNotifications();
    setNotificationsSupabase(notifications);
    setIsUpdatingNotifications(false);
  };

  useEffect(() => {
    updateNotifications();
  }, []);

  if (!showHeader) return null;

  return (
    <NotificationsContext.Provider
      value={{
        notifications: notificationsSupabase,
        isUpdatingNotifications,
        updateNotifications,
      }}
    >
      <Flex
        data-cy="header"
        sx={{
          backgroundColor: 'white',
          borderBottom: ['1px solid #e7e7e7', '1px solid #e7e7e7', '1px solid #ddd'],
          px: [2, 2, '24px'],
          zIndex: (theme as any).zIndex.header,
          position: 'relative',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: [56, 56, 74],
        }}
      >
        <Flex sx={{ alignItems: 'center' }}>
          <Logo />
          {isLoggedIn && (
            <AuthWrapper roleRequired={UserRole.BETA_TESTER} borderLess>
              <Flex className="user-beta-icon" sx={{ alignItems: 'center', marginLeft: 4 }}>
                <Text
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.4rem',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    backgroundColor: 'lightgrey',
                  }}
                >
                  BETA
                </Text>
              </Flex>
            </AuthWrapper>
          )}
        </Flex>

        <Flex
          className="menu-desktop"
          sx={{ alignItems: 'center', gap: '24px', position: 'relative' }}
        >
          <MenuDesktop />
          <Flex sx={{ alignItems: 'center', gap: '8px' }}>
            {isLoggedIn && <NotificationsSupabase device="desktop" />}
            <Profile />
          </Flex>
        </Flex>
      </Flex>

      <MobileBottomNav />
    </NotificationsContext.Provider>
  );
});

export default Header;
