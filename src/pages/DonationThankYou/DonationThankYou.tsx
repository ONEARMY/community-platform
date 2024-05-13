import { useEffect } from 'react'
import { Flex, Image, Text } from 'theme-ui'

import IconArrowDown from '../../assets/icons/icon-arrow-down.svg'

// This page should be loaded from within an iframe when a donation is made
const DonationThankYou = () => {
  const sendMessage = () => {
    if (window && window.parent) {
      window.parent.postMessage('CAN_START_FILE_DOWNLOAD', '*')
    }
  }

  useEffect(() => {
    sendMessage()
  }, [])

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2, padding: 2 }}>
      <Text as="h2" sx={{ textAlign: 'center' }}>
        Thank you!
      </Text>
      <Text as="p" sx={{ textAlign: 'center' }}>
        Epic ♡ Your donation is helping more plastic being recycled.
      </Text>
      <Text
        as="p"
        sx={{ fontStyle: 'italics', textAlign: 'center', paddingTop: 5 }}
      >
        (If your download hasn't started yet, please click the button below.)
        <br />
        <Image loading="lazy" src={IconArrowDown} sx={{ width: '20px' }} />
      </Text>
    </Flex>
  )
}

export default DonationThankYou
