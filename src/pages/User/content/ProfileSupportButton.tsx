import type { Profile } from 'oa-shared';
import { useState } from 'react';
import { trackEvent } from 'src/common/Analytics';
import { DonationRequestModalContainer } from 'src/common/DonationRequestModalContainer';
import { Button } from '@/components/ui/button';
import DonateIcon from '@/components/ui/icons/donate.svg?react';

interface IProps {
  profile: Profile;
}

export const ProfileSupportButton = ({ profile }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DonationRequestModalContainer
        profileId={profile.id}
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
      />
      <Button
        variant="outline"
        onClick={() => {
          trackEvent({
            action: 'donationModalOpened',
            category: 'profiles',
            label: profile.username || undefined,
          });
          setIsOpen(true);
        }}
      >
        <DonateIcon data-icon="inline-start" aria-hidden="true" className="text-primary" />
        Support this {profile.type?.displayName || 'space'}
      </Button>
    </>
  );
};
