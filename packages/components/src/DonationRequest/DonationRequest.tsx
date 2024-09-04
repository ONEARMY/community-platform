import { AspectImage, Card, Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { ExternalLink } from '../ExternalLink/ExternalLink'

export interface IProps {
  body: string | undefined
  callback: () => void
  iframeSrc: string | undefined
  imageURL: string | undefined
  link: string
}

const FALLBACK_DONATION_WIDGET = 'https://donorbox.org/embed/onearmy?a=b'
const REQUEST_TITLE = 'Support our work'
const REQUEST_THANKYOU = 'Thank you for helping to make this possible'
export const BUTTON_LABEL = 'Download'

export const DonationRequest = (props: IProps) => {
  const { body, callback, iframeSrc, imageURL, link } = props
  const iframeArgs = {
    allowpaymentrequest: 'allowpaymentrequest',
    allow: 'payment',
    'data-donorbox-id': 'DonorBox-f2',
    'data-testid': 'donationRequestIframe',
    frameBorder: '0',
    name: 'donorbox',
    seamless: true,
    src: iframeSrc || FALLBACK_DONATION_WIDGET,
  }

  return (
    <Card
      sx={{
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      data-cy="DonationRequest"
      data-testid="DonationRequest"
    >
      <script
        src="https://donorbox.org/widget.js"
        data-paypalexpress="false"
      ></script>

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
            minHeight: '650px',
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

      <Flex
        sx={{
          backgroundColor: 'offWhite',
          borderTop: '2px solid',
          flexDirection: ['column', 'row'],
          padding: 2,
          gap: 2,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <ExternalLink
          href={link}
          onClick={callback}
          data-cy="DonationRequestSkip"
          data-testid="DonationRequestSkip"
        >
          <Button>{BUTTON_LABEL}</Button>
        </ExternalLink>
      </Flex>
    </Card>
  )
}
