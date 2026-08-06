import { observer } from 'mobx-react';
import { Banner, InternalLink } from 'oa-components';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex, Text } from 'theme-ui';

export const AlertOrganisationModeration = observer(() => {
  const { profile } = useProfileStore();

  const isPending =
    profile?.moderation === 'awaiting-moderation' || profile?.moderation === 'improvements-needed';

  if (!isPending) {
    return null;
  }

  return (
    <Flex data-cy="organisation-moderation-banner">
      <Banner sx={{ backgroundColor: 'softblue', color: 'black' }}>
        <Text sx={{ textAlign: 'center' }}>
          Your organisation application is being reviewed. Until approved, your profile is not
          visible to others.{' '}
          <InternalLink
            data-cy="organisation-moderation-see-details"
            to="/settings/profile"
            sx={{ color: 'inherit', textDecoration: 'underline' }}
          >
            See details.
          </InternalLink>
        </Text>
      </Banner>
    </Flex>
  );
});
