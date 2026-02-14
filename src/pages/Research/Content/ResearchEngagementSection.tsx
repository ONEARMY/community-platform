import { observer } from 'mobx-react';
import { ArticleCallToActionSupabase, Button, FollowButton, UsefulStatsButton, UserEngagementWrapper } from 'oa-components';
import type { ResearchItem } from 'oa-shared';
import { useState } from 'react';
import { trackEvent } from 'src/common/Analytics';
import { DonationRequestModalContainer } from 'src/common/DonationRequestModalContainer';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { useSubscription } from 'src/stores/Subscription/useSubscription';
import { useUsefulVote } from 'src/stores/UsefulVote/useUsefulVote';
import { Box } from 'theme-ui';

type ResearchEngagementSectionProps = {
  research: ResearchItem;
};

const ResearchEngagementSection = observer(({ research }: ResearchEngagementSectionProps) => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const { profile } = useProfileStore();
  const { isSubscribed, toggle: toggleSubscription } = useSubscription('research', research.id);
  const { hasVoted, toggle: toggleVote } = useUsefulVote('research', research.id, research.usefulCount || 0);

  return (
    <UserEngagementWrapper>
      <Box
        sx={{
          marginBottom: [6, 6, 12],
        }}
      >
        {research.author && (
          <ArticleCallToActionSupabase author={research.author} contributors={research.collaborators}>
            <UsefulStatsButton isLoggedIn={!!profile} hasUserVotedUseful={hasVoted} onUsefulClick={toggleVote} />
            <FollowButton
              isLoggedIn={!!profile}
              onFollowClick={() => toggleSubscription()}
              isFollowing={isSubscribed}
              tooltipFollow="Follow to be notified about new updates"
              tooltipUnfollow="Unfollow to stop being notified about new updates"
              sx={{ backgroundColor: '#fff' }}
            />
            {research.author?.profileType?.isSpace && research.author?.donationsEnabled && (
              <>
                <DonationRequestModalContainer
                  profileId={research.author?.id}
                  isOpen={isDonationModalOpen}
                  onDidDismiss={() => setIsDonationModalOpen(false)}
                />
                <Button
                  icon="donate"
                  variant="outline"
                  iconColor="primary"
                  sx={{ fontSize: '14px', backgroundColor: '#fff' }}
                  onClick={() => {
                    trackEvent({
                      action: 'donationModalOpened',
                      category: 'research',
                      label: research.author?.username || '',
                    });
                    setIsDonationModalOpen(true);
                  }}
                >
                  Support the author
                </Button>
              </>
            )}
          </ArticleCallToActionSupabase>
        )}
      </Box>
    </UserEngagementWrapper>
  );
});
export default ResearchEngagementSection;
