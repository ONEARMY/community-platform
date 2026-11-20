import { observer } from 'mobx-react';
import { Banner } from 'oa-components';
import { Link } from 'react-router';
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
          <Link
            data-cy="organisation-moderation-see-details"
            to="/settings/profile"
            className="text-inherit underline"
          >
            See details.
          </Link>
        </Text>
      </Banner>
    </Flex>
  );
});
