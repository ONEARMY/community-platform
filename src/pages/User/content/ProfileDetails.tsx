import { Button, ProfileTagsList, UserStatistics, VisitorModal } from 'oa-components';
import type { MapPin, Profile, UserCreatedDocs } from 'oa-shared';
import { PremiumTier } from 'oa-shared';
import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from 'src/common/Analytics';
import { DonationRequestModalContainer } from 'src/common/DonationRequestModalContainer';
import { PremiumTierWrapper } from 'src/common/PremiumTierWrapper';
import { mapPinService } from 'src/pages/Maps/map.service';
import { Box, Divider, Flex, Paragraph } from 'theme-ui';

interface IProps {
  docs: UserCreatedDocs;
  profile: Profile;
  selectTab: (target: string) => void;
}

export const ProfileDetails = ({ docs, profile, selectTab }: IProps) => {
  const { about, tags, visitorPolicy } = profile;
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const [pin, setPin] = useState<MapPin | undefined>(undefined);

  useEffect(() => {
    const getPin = async () => {
      try {
        const pin = await mapPinService.getMapPinById(profile.id);
        if (pin) {
          setPin(pin);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getPin();
  }, [profile.id]);

  const hideVisitorDetails = (target?: string) => {
    setShowVisitorModal(false);
    if (target) {
      selectTab(target);
    }
  };

  const userTotalUseful = useMemo(() => {
    if (!profile?.authorUsefulVotes) {
      return 0;
    }

    return profile.authorUsefulVotes.reduce((sum, vote) => sum + vote.voteCount, 0);
  }, [profile.authorUsefulVotes]);

  return (
    <Box style={{ height: '100%' }}>
      <Flex
        sx={{
          alignItems: 'stretch',
          flexDirection: ['column', 'row', 'row'],
          gap: 4,
          justifyContent: 'space-between',
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            flex: 1,
            gap: 2,
          }}
        >
          {(tags || visitorPolicy) && (
            <ProfileTagsList
              tags={tags || null}
              visitorPolicy={visitorPolicy}
              isSpace={profile.type?.isSpace || false}
              showVisitorModal={() => setShowVisitorModal(true)}
              large={true}
            />
          )}
          {about && (
            <Paragraph
              sx={{
                whiteSpace: 'pre-wrap',
              }}
            >
              {about}
            </Paragraph>
          )}

          {visitorPolicy && <VisitorModal show={showVisitorModal} hide={hideVisitorDetails} user={profile} />}
        </Flex>
        <Divider
          sx={{
            width: ['100%', '1px', '1px'],
            height: ['1px', 'auto', 'auto'],
            alignSelf: 'stretch',
            border: ['none', '2px solid #0000001A', '2px solid #0000001A'],
            borderTop: '2px solid #0000001A',
            margin: 0,
          }}
        />
        <Flex sx={{ flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
          {profile.type?.isSpace && profile?.donationsEnabled && (
            <>
              <DonationRequestModalContainer
                profileId={profile?.id}
                isOpen={isDonationModalOpen}
                onDidDismiss={() => setIsDonationModalOpen(false)}
              />
              <Button
                icon="donate"
                variant="outline"
                iconColor="primary"
                sx={{ backgroundColor: 'white', borderBottom: '4px solid' }}
                onClick={() => {
                  trackEvent({
                    action: 'donationModalOpened',
                    category: 'profiles',
                    label: profile.username,
                  });
                  setIsDonationModalOpen(true);
                }}
              >
                Support this {profile.type?.displayName || 'space'}
              </Button>
            </>
          )}
          <PremiumTierWrapper
            tierRequired={PremiumTier.ONE}
            fallback={
              <UserStatistics
                profile={profile}
                pin={pin}
                libraryCount={docs?.projects.length || 0}
                usefulCount={userTotalUseful}
                researchCount={docs?.research.length || 0}
                questionCount={docs?.questions.length || 0}
                showViews={false}
              />
            }
          >
            <UserStatistics
              profile={profile}
              pin={pin}
              libraryCount={docs?.projects.length || 0}
              usefulCount={userTotalUseful}
              researchCount={docs?.research.length || 0}
              questionCount={docs?.questions.length || 0}
              showViews
            />
          </PremiumTierWrapper>
        </Flex>
      </Flex>
    </Box>
  );
};
