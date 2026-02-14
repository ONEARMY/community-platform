import { observer } from 'mobx-react';
import { ContentStatistics, FollowButton, UsefulStatsButton } from 'oa-components';
import { PremiumTier, type ResearchItem } from 'oa-shared';
import { ClientOnly } from 'remix-utils/client-only';
import { userHasPremiumTier } from 'src/common/PremiumTierWrapper';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { useSubscription } from 'src/stores/Subscription/useSubscription';
import { useUsefulVote } from 'src/stores/UsefulVote/useUsefulVote';
import { buildStatisticsLabel } from 'src/utils/helpers';
import { createUsefulStatistic } from 'src/utils/statistics';
import { Flex } from 'theme-ui';

type ResearchFooterProps = {
  research: ResearchItem;
};

const ResearchFooter = observer(({ research }: ResearchFooterProps) => {
  const { profile } = useProfileStore();
  const { isSubscribed, toggle: toggleSubscription } = useSubscription('research', research.id);
  const { hasVoted, usefulCount, toggle: toggleVote } = useUsefulVote('research', research.id, research.usefulCount || 0);

  return (
    <Flex
      sx={{
        flexDirection: 'row',
        padding: [2, 3],
        gap: 3,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <Flex sx={{ gap: 3 }}>
        <ClientOnly fallback={<></>}>
          {() => (
            <>
              <UsefulStatsButton hasUserVotedUseful={hasVoted} isLoggedIn={!!profile} onUsefulClick={toggleVote} />
              <FollowButton
                isFollowing={isSubscribed}
                isLoggedIn={!!profile}
                onFollowClick={toggleSubscription}
                tooltipFollow="Follow to be notified about new updates"
                tooltipUnfollow="Unfollow to stop being notified about new updates"
              />
            </>
          )}
        </ClientOnly>
      </Flex>

      <ContentStatistics
        statistics={[
          {
            icon: 'show',
            label: buildStatisticsLabel({
              stat: research.totalViews || 0,
              statUnit: 'view',
              usePlural: true,
            }),
            stat: research.totalViews || 0,
          },
          {
            icon: 'thunderbolt-grey',
            label: buildStatisticsLabel({
              stat: research.subscriberCount || 0,
              statUnit: 'following',
              usePlural: false,
            }),
            stat: research.subscriberCount || 0,
          },
          createUsefulStatistic('research', research.id, usefulCount, userHasPremiumTier(profile, PremiumTier.ONE)),
          {
            icon: 'comment-outline',
            label: buildStatisticsLabel({
              stat: research.commentCount || 0,
              statUnit: 'comment',
              usePlural: true,
            }),
            stat: research.commentCount || 0,
          },
          {
            icon: 'update',
            label: buildStatisticsLabel({
              stat: research.updateCount || 0,
              statUnit: 'update',
              usePlural: true,
            }),
            stat: research.updateCount || 0,
          },
        ]}
        alwaysShow
      />
    </Flex>
  );
});
export default ResearchFooter;
