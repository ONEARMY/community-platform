import { observer } from 'mobx-react';
import { Banner, InternalLink } from 'oa-components';
import { useLocation } from 'react-router';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex } from 'theme-ui';

export const AlertOrganisationModeration = observer(() => {
  const { profile } = useProfileStore();
  const { pathname } = useLocation();

  if (profile?.moderation !== 'awaiting-moderation') {
    return null;
  }

  // The "See details." link points at /settings/profile, so hide it when already there
  const isOnProfileSettings = pathname.startsWith('/settings/profile');

  return (
    <Flex data-cy="organisation-moderation-banner">
      <Banner sx={{ backgroundColor: 'softblue', color: 'black', gap: 1 }}>
        Your organisation application is being reviewed. Until approved, your profile is not visible
        to others.{' '}
        {!isOnProfileSettings && (
          <InternalLink
            data-cy="organisation-moderation-details"
            to="/settings/profile"
            sx={{ color: 'inherit', textDecoration: 'underline' }}
          >
            See details.
          </InternalLink>
        )}
      </Banner>
    </Flex>
  );
});
