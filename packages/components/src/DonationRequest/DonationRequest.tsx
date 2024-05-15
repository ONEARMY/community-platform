import { useEffect, useState } from 'react'
import { AspectImage, Card, Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { ExternalLink } from '../ExternalLink/ExternalLink'

export interface IProps {
  body: string
  callback: () => void
  iframeSrc: string
  imageURL: string
  link: string
}

const REQUEST_TITLE = 'Support our work'
const REQUEST_THANKYOU = 'Thank you for helping to make this possible'
export const REQUEST_BUTTON_SKIP = 'Skip this time'
export const REQUEST_BUTTON_DOWNLOAD = 'Download Now!'

export const DonationRequest = (props: IProps) => {
  const { body, callback, iframeSrc, imageURL, link } = props
  const [isStartDownload, setIsStartDownload] = useState<boolean>(false)
  const iframeArgs = {
    allowpaymentrequest: 'allowpaymentrequest',
    allow: 'payment',
    'data-donorbox-id': 'DonorBox-f2',
    'data-testid': 'donationRequestIframe',
    frameBorder: '0',
    name: 'donorbox',
    seamless: true,
    src: iframeSrc,
  }

  const handleMessage = (event: MessageEvent) => {
    if (event.origin != window.location.origin) {
      return
    }

    switch (event.data) {
      case 'CAN_START_FILE_DOWNLOAD':
        setIsStartDownload(true)
        window.open(link)
        break
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

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
          <Flex sx={{ display: ['none', 'inline'] }}>
            <AspectImage
              loading="lazy"
              ratio={16 / 7}
              src={imageURL}
              alt={REQUEST_TITLE}
              data-testid="donationRequestImage"
            />
          </Flex>

          <Text sx={{ padding: [2, 4, 6] }}>
            <Text as="h1">{REQUEST_TITLE}</Text>
            <p>{body}</p>
            <p>{REQUEST_THANKYOU}</p>
          </Text>
        </Flex>

        <Flex
          sx={{
            borderLeft: [0, '2px solid'],
            minHeight: [isStartDownload ? '400px' : '650px', '650px'],
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
          backgroundColor: 'offwhite',
          borderTop: '2px solid',
          flexDirection: ['column', 'row'],
          padding: 2,
          gap: 2,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        {isStartDownload && (
          <Text as="p" sx={{ color: 'grey', textAlign: 'center' }}>
            Download hasn't started yet? Tap the button
          </Text>
        )}

        <ExternalLink
          href={link}
          onClick={callback}
          data-cy="DonationRequestSkip"
        >
          <Button>
            {isStartDownload ? REQUEST_BUTTON_DOWNLOAD : REQUEST_BUTTON_SKIP}
          </Button>
        </ExternalLink>
      </Flex>
    </Card>
  )
}
