import { AspectImage, Card, Flex, Text } from 'theme-ui';

export type DonationRequestProps = {
  body: string | undefined;
  iframeSrc: string | undefined;
  imageURL: string | undefined;
};

const FALLBACK_DONATION_WIDGET = 'https://donorbox.org/embed/onearmy?a=b';
const REQUEST_TITLE = 'Support our work';
const REQUEST_THANKYOU = 'Thank you for helping to make this possible';

export const DonationRequest = (props: DonationRequestProps) => {
  const { body, iframeSrc, imageURL } = props;
  const iframeArgs = {
    allowpaymentrequest: 'allowpaymentrequest',
    allow: 'payment',
    'data-donorbox-id': 'DonorBox-f2',
    'data-testid': 'donationRequestIframe',
    frameBorder: '0',
    name: 'donorbox',
    seamless: true,
    src: iframeSrc || FALLBACK_DONATION_WIDGET,
  };

  return (
    <>
      <Card
        sx={{
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          borderRadius: '4px 4px 0 0',
        }}
        data-cy="DonationRequest"
        data-testid="DonationRequest"
      >
        <script src="https://donorbox.org/widget.js" data-paypalexpress="false"></script>

        <Flex
          sx={{
            flexDirection: ['column', 'row'],
          }}
        >
          <Flex sx={{ flexDirection: 'column', flex: 1 }}>
            {imageURL && (
              <Flex sx={{ display: ['none', 'inline'] }}>
                <AspectImage
                  loading="lazy"
                  ratio={16 / 9}
                  src={imageURL}
                  alt={REQUEST_TITLE}
                  data-testid="donationRequestImage"
                />
              </Flex>
            )}

            <Text sx={{ padding: [2, 4, 6] }}>
              <Text as="h1">{REQUEST_TITLE}</Text>
              <p>{body}</p>
              <p>{REQUEST_THANKYOU}</p>
            </Text>
          </Flex>

          <Flex
            sx={{
              borderLeft: [0, '2px solid'],
              minHeight: '542px',
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
    </>
  );
};
