import { DonationRequestModal } from 'oa-components';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

type DonationRequestModalContainerProps = {
  isOpen: boolean;
  onDidDismiss: () => void;
  profileId?: number;
  children?: ReactNode | ReactNode[];
};

type DonationSettings = {
  spaceName: string;
  description: string;
  imageUrl: string;
  campaignId: string;
};

export const DonationRequestModalContainer = (props: DonationRequestModalContainerProps) => {
  const [settings, setSettings] = useState<DonationSettings>();
  const embedUrl = `https://donorbox.org/embed/${settings?.campaignId}`;

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch(`/api/donation-settings/${props.profileId || 'default'}`);
      const { spaceName, description, imageUrl, campaignId } = await response.json();

      setSettings({ spaceName, description, imageUrl, campaignId });
    };

    if (props.isOpen && !settings) {
      fetchSettings();
    }
  }, [props.isOpen, settings]);

  return (
    <>
      {settings?.campaignId && (
        <DonationRequestModal
          spaceName={settings.spaceName}
          description={settings.description}
          iframeSrc={embedUrl}
          imageUrl={settings.imageUrl}
          isOpen={props.isOpen}
          onDidDismiss={props.onDidDismiss}
        >
          {props.children}
        </DonationRequestModal>
      )}
    </>
  );
};
