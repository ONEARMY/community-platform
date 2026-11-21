import { MemberBadge, ProfileTagsList, UserStatistics, VisitorModal } from 'oa-components';
import type { Profile, UserCreatedDocs } from 'oa-shared';
import { PremiumTier } from 'oa-shared';
import { useMemo, useState } from 'react';
import { PremiumTierWrapper } from 'src/common/PremiumTierWrapper';

interface IProps {
  docs: UserCreatedDocs;
  profile: Profile;
}

export const ProfileDetails = ({ docs, profile }: IProps) => {
  const { type, visitorPolicy } = profile;
  const [showVisitorModal, setShowVisitorModal] = useState(false);

  const userTotalUseful = useMemo(
    () => profile.authorUsefulVotes?.reduce((sum, vote) => sum + vote.voteCount, 0) ?? 0,
    [profile.authorUsefulVotes],
  );

  const statistics = (showViews: boolean) => (
    <UserStatistics
      profile={{ ...profile, badges: [] }}
      libraryCount={docs?.projects.length || 0}
      usefulCount={userTotalUseful}
      researchCount={docs?.research.length || 0}
      questionCount={docs?.questions.length || 0}
      showViews={showViews}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        {type && (
          <span className="flex items-center gap-2">
            <MemberBadge profileType={type} size={40} />
            {type.displayName}
          </span>
        )}

        {visitorPolicy && (
          <>
            <ProfileTagsList
              tags={null}
              visitorPolicy={visitorPolicy}
              isSpace={type?.isSpace || false}
              showVisitorModal={() => setShowVisitorModal(true)}
              large={true}
            />
            <VisitorModal
              show={showVisitorModal}
              hide={() => setShowVisitorModal(false)}
              user={profile}
            />
          </>
        )}
      </div>

      <PremiumTierWrapper tierRequired={PremiumTier.ONE} fallback={statistics(false)}>
        {statistics(true)}
      </PremiumTierWrapper>
    </div>
  );
};
