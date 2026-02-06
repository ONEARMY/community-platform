import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Tabs } from '@mui/base/Tabs';
import { observer } from 'mobx-react';
import { isPreciousPlastic } from 'src/config/config';
import { isModuleSupported, MODULE } from 'src/modules';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Box, Flex, Text } from 'theme-ui';

import { EnvironmentContext } from '../common/EnvironmentContext';
import { SettingsFormTab } from './SettingsFormTab';
import { SettingsFormTabList } from './SettingsFormTabList';
import { SettingsPageAccount } from './SettingsPageAccount';
import { SettingsPageImpact } from './SettingsPageImpact';
import { SettingsPageMapPin } from './SettingsPageMapPin';
import { SettingsPageNotifications } from './SettingsPageNotifications';
import { SettingsPageUserProfile } from './SettingsPageUserProfile';

import type { availableGlyphs } from 'oa-components';
import type { ISettingsTab } from './types';

import '../../styles/leaflet.css';

export const SettingsPage = observer(() => {
  const env = useContext(EnvironmentContext);
  const { isComplete, missingFields, profile } = useProfileStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!profile) {
    return null;
  }

  const isMember = !profile.type?.isSpace;
  const showImpactTab = !isMember && isPreciousPlastic();
  const showMapTab = isModuleSupported(env?.VITE_SUPPORTED_MODULES || '', MODULE.MAP);

  const tabs: ISettingsTab[] = [
    {
      title: 'Profile',
      route: '/settings/profile',
      header: isComplete === false && (
        <Flex sx={{ gap: 2, flexDirection: 'column' }} data-cy="CompleteProfileHeader">
          <Text as="h3">✏️ Complete your profile</Text>
          <Text>
            In order to post comments or create content, we'd like you to share something about
            yourself.
          </Text>
          {missingFields && missingFields.length > 0 && (
            <Text>
              Missing required fields:
              <ul style={{ margin: '0.5em 0 0 0', paddingLeft: '1.5em' }}>
                {missingFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </Text>
          )}
        </Flex>
      ),
      body: <SettingsPageUserProfile />,
      glyph: 'profile' as availableGlyphs,
    },
    ...(showMapTab
      ? [
          {
            title: 'Map',
            route: '/settings/map',
            body: <SettingsPageMapPin />,
            glyph: 'map' as availableGlyphs,
          },
        ]
      : []),
    ...(showImpactTab
      ? [
          {
            title: 'Impact',
            route: '/settings/impact',
            body: <SettingsPageImpact />,
            glyph: 'impact' as availableGlyphs,
          },
        ]
      : []),
    {
      title: 'Notifications',
      route: '/settings/notifications',
      body: <SettingsPageNotifications />,
      glyph: 'megaphone' as availableGlyphs,
    },
    {
      title: 'Account',
      route: '/settings/account',
      body: <SettingsPageAccount />,
      glyph: 'account' as availableGlyphs,
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: '1000px',
        width: '100%',
        alignSelf: 'center',
        paddingTop: [3, 5, 10],
      }}
    >
      <Tabs value={pathname}>
        <Flex
          sx={{
            alignContent: 'stretch',
            alignSelf: 'stretch',
            justifyContent: 'stretch',
            flexDirection: ['column', 'row'],
            gap: 4,
          }}
        >
          <SettingsFormTabList
            tabs={tabs}
            currentTab={pathname}
            onTabChange={(path) => navigate(path)}
          />
          <Flex
            sx={{
              alignContent: 'stretch',
              justifyContent: 'stretch',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            {tabs.map((tab) => (
              <SettingsFormTab key={tab.title} value={tab.route} tab={tab} />
            ))}
          </Flex>
        </Flex>
      </Tabs>
    </Box>
  );
});
