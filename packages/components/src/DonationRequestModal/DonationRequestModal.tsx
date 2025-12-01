import { AspectImage, Card, Flex, Text } from 'theme-ui';

import { Modal } from '../Modal/Modal';

export interface IProps {
  description?: string;
  imageUrl?: string;
  iframeSrc?: string;
  spaceName?: string;
  isOpen: boolean;
  onDidDismiss: () => void;
  children?: React.ReactNode | React.ReactNode[];
}

const FALLBACK_DONATION_WIDGET = 'https://donorbox.org/embed/onearmy?a=b&hide_donation_meter=true';
const REQUEST_THANKYOU = 'Thank you for helping to make this possible!';

export const DonationRequestModal = (props: IProps) => {
  const { spaceName, description, iframeSrc, imageUrl, isOpen, onDidDismiss, children } = props;
  const title = spaceName ? `Support ${spaceName}` : 'Support our work';
  const iframeArgs = {
    allowpaymentrequest: 'allowpaymentrequest',
    allow: 'payment',
    'data-donorbox-id': 'DonorBox-f2',
    'data-testid': 'donationRequestIframe',
    name: 'donorbox',
    seamless: true,
    src: iframeSrc ? iframeSrc + '?hide_donation_meter=true' : FALLBACK_DONATION_WIDGET,
  };

  return (
    <Modal
      onDidDismiss={onDidDismiss}
      isOpen={isOpen}
      sx={{
        width: ['500px', '750px', '1050px'],
        minWidth: '350px',
        border: '0 !important',
        background: 'none !important',
      }}
    >
      <Card
        sx={{
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          borderRadius: '4px 4px 0 0',
        }}
        data-cy="DonationRequest"
        data-testid="DonationRequest"
      >
        <script
          src="https://donorbox.org/widget.js"
          type="module"
          data-paypalexpress="false"
          async
        ></script>
        <Flex
          sx={{
            flexDirection: ['column', 'row'],
          }}
        >
          <Flex sx={{ flexDirection: 'column', flex: 1 }}>
            {imageUrl && (
              <Flex sx={{ display: ['none', 'inline'] }}>
                <AspectImage
                  loading="lazy"
                  ratio={16 / 9}
                  src={imageUrl}
                  alt={title}
                  data-testid="donationRequestImage"
                />
              </Flex>
            )}

            <Text sx={{ padding: [2, 4, 6] }}>
              <Text as="h1">{title}</Text>
              <p>{description}</p>
              <p>{REQUEST_THANKYOU}</p>
            </Text>
          </Flex>

          <Flex
            sx={{
              borderLeft: [0, '2px solid'],
              minHeight: '524px',
              width: ['100%', '350px', '400px'],
            }}
          >
            <iframe
              {...iframeArgs}
              loading="lazy"
              style={{ border: '0', overflow: 'scroll', width: '100%' }}
            ></iframe>
          </Flex>
        </Flex>
      </Card>
      {children}
    </Modal>
  );
};
