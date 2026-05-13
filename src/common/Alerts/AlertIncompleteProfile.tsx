import { observer } from 'mobx-react';
import { Banner, InternalLink } from 'oa-components';
import { useLocation } from 'react-router';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex } from 'theme-ui';

export const AlertIncompleteProfile = observer(() => {
  const { isComplete } = useProfileStore();
  const { pathname } = useLocation();
  const isOnSupporterPage = pathname.startsWith('/supporter');

  if (isComplete !== false || isOnSupporterPage) {
    return null;
  }

  return (
    <InternalLink to="/settings">
      <Flex data-cy="incompleteProfileBanner">
        <Banner sx={{ backgroundColor: 'softblue', color: 'black', cursor: 'hand' }}>
          Hey there! 👋 Please complete your profile before posting!
        </Banner>
      </Flex>
    </InternalLink>
  );
});
