import { observer } from 'mobx-react';
import { Banner } from 'oa-components';
import { Link, useLocation } from 'react-router';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex } from 'theme-ui';

export const AlertIncompleteProfile = observer(() => {
  const { isComplete } = useProfileStore();
  const { pathname } = useLocation();
  const isOnSupporterPage = pathname.startsWith('/support');

  if (isComplete !== false || isOnSupporterPage) {
    return null;
  }

  return (
    <Link to="/settings">
      <Flex data-cy="incompleteProfileBanner">
        <Banner sx={{ backgroundColor: 'softblue', color: 'black', cursor: 'hand' }}>
          Hey there! 👋 Please complete your profile before posting!
        </Banner>
      </Flex>
    </Link>
  );
});
