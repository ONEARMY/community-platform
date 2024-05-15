import { useEffect } from 'react'
import Confetti from 'src/assets/images/confetti.svg'
import { Flex, Image, Text } from 'theme-ui'

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
    <Flex
      sx={{
        flexGrow: 1,
        flexDirection: 'column',
        gap: 3,
        paddingX: 5,
        paddingY: 7,
        alignItems: 'center',
        justifyContent: 'stretch',
        backgroundColor: 'offwhite',
      }}
    >
      <Image loading="lazy" src={Confetti} sx={{ width: '200px' }} />

      <Text as="h2" sx={{ textAlign: 'center' }}>
        Thank you!
      </Text>
      <Text as="p" sx={{ textAlign: 'center' }}>
        Epic ♡ Your donation is helping more plastic being recycled.
      </Text>
    </Flex>
  )
}

export default DonationThankYou
