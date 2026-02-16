import { withTheme } from '@emotion/react';
import { animated, useSpring } from '@react-spring/web';
import { observer } from 'mobx-react';
import { Button } from 'oa-components';
import type { NotificationDisplay } from 'oa-shared';
import { UserRole } from 'oa-shared';
import type { ThemeWithName } from 'oa-themes';
import { useContext, useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { isModuleSupported, MODULE } from 'src/modules';
import Logo from 'src/pages/common/Header/Menu/Logo/Logo';
import MenuDesktop from 'src/pages/common/Header/Menu/MenuDesktop';
import MenuMobilePanel from 'src/pages/common/Header/Menu/MenuMobile/MenuMobilePanel';
import Profile from 'src/pages/common/Header/Menu/Profile/Profile';
import { notificationSupabaseService } from 'src/services/notificationsSupabaseService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex, Text, useThemeUI } from 'theme-ui';
import { NotificationsContext } from '../NotificationsContext';
import { TenantContext } from '../TenantContext';
import { NotificationsSupabase } from './Menu/Notifications/NotificationsSupabase';
import { MobileMenuContext } from './MobileMenuContext';

const MobileNotificationsWrapper = ({ children }) => {
  const themeUi = useThemeUI();
  const theme = themeUi.theme as ThemeWithName;

  return (
    <Flex
      sx={{
        alignItems: 'center',
        gap: 2,
        position: 'relative',
        [`@media only screen and (max-width: ${theme.breakpoints![1]})`]: {
          display: 'flex',
          marginLeft: '1em',
          marginRight: 'auto',
        },
        [`@media only screen and (min-width: ${theme.breakpoints![1]})`]: {
          display: 'none',
        },
      }}
    >
      {children}
    </Flex>
  );
};

const MobileMenuWrapper = ({ children, ...props }) => (
  <Flex {...props} sx={{ position: 'relative', display: ['flex', 'flex', 'none'] }}>
    {children}
  </Flex>
);

const AnimationContainer = (props: any) => {
  const springStyle = useSpring({
    from: { top: '-100%' },
    to: { top: '0' },
    config: { duration: 250 },
  });

  return <animated.div style={{ position: 'relative', ...springStyle }}>{props.children}</animated.div>;
};

const Header = observer(() => {
  const { theme } = useThemeUI();
  const tenantContext = useContext(TenantContext);
  const { profile } = useProfileStore();
  const isLoggedIn = !!profile;

  const [isVisible, setIsVisible] = useState(false);

  // New notifications states
  const [notificationsSupabase, setNotificationsSupabase] = useState<NotificationDisplay[] | null>(null);
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

  return (
    <NotificationsContext.Provider
      value={{
        notifications: notificationsSupabase,
        isUpdatingNotifications,
        updateNotifications,
      }}
    >
      <MobileMenuContext.Provider
        value={{
          isVisible,
          setIsVisible,
        }}
      >
        <Flex
          data-cy="header"
          sx={{
            backgroundColor: 'white',
            px: [4, 4, 0],
            zIndex: (theme as any).zIndex.header,
            position: 'relative',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: [null, null, 80],
          }}
        >
          <Flex>
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
          {isLoggedIn && (
            <MobileNotificationsWrapper>
              <NotificationsSupabase device="mobile" />
            </MobileNotificationsWrapper>
          )}
          <Flex
            className="menu-desktop"
            sx={{
              alignItems: 'center',
              paddingX: 2,
              position: 'relative',
              display: ['none', 'none', 'flex'],
              gap: 2,
            }}
          >
            <MenuDesktop />
            {isLoggedIn && <NotificationsSupabase device="desktop" />}
            {isModuleSupported(tenantContext?.environment?.VITE_SUPPORTED_MODULES || '', MODULE.USER) && <Profile isMobile={false} />}
          </Flex>
          <ClientOnly fallback={<></>}>
            {() => (
              <MobileMenuWrapper className="menu-mobile">
                <Flex sx={{ paddingLeft: 5 }}>
                  <Button
                    type="button"
                    showIconOnly={true}
                    icon={isVisible ? 'close' : 'menu'}
                    onClick={() => setIsVisible(!isVisible)}
                    large={true}
                    sx={{
                      marginRight: -3,
                      backgroundColor: 'white',
                      borderWidth: '0px',
                      '&:hover': {
                        backgroundColor: 'white',
                      },
                      '&:active': {
                        backgroundColor: 'white',
                      },
                    }}
                  />
                </Flex>
              </MobileMenuWrapper>
            )}
          </ClientOnly>
        </Flex>
        {isVisible && (
          <AnimationContainer key="mobilePanelContainer">
            <MobileMenuWrapper>
              <MenuMobilePanel />
            </MobileMenuWrapper>
          </AnimationContainer>
        )}
      </MobileMenuContext.Provider>
    </NotificationsContext.Provider>
  );
});

export default withTheme(Header);
