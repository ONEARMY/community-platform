import { useEffect, useState } from 'react';
import { DonationRequestModal } from 'oa-components';

import type { ReactNode } from 'react';

interface DonationRequestModalContainerProps {
  campaingId?: string;
  isOpen: boolean;
  onDidDismiss: () => void;
  children?: ReactNode | ReactNode[];
}

type DonationSettings = {
  body: string;
  imageURL: string;
  defaultCampaignId: string;
};

export const DonationRequestModalContainer = (props: DonationRequestModalContainerProps) => {
  // const body = import.meta.env.VITE_DONATIONS_BODY;
  // const iframeSrc = import.meta.env.VITE_DONATIONS_IFRAME_SRC;
  // const imageURL = import.meta.env.VITE_DONATIONS_IMAGE_URL;

  const [settings, setSettings] = useState<DonationSettings>();
  const embedUrl = `https://donorbox.org/embed/${props.campaingId || settings?.defaultCampaignId}`;

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch('/donation-settings');
      const { body, imageURL, defaultCampaignId } = await response.json();

      setSettings({ body, imageURL, defaultCampaignId });
    };

    fetchSettings();
  }, []);

  return (
    <>
      {settings && (
        <DonationRequestModal
          body={settings.body}
          iframeSrc={embedUrl}
          imageURL={settings.imageURL}
          isOpen={props.isOpen}
          onDidDismiss={props.onDidDismiss}
        >
          {props.children}
        </DonationRequestModal>
      )}
    </>
  );
};
