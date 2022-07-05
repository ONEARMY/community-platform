import { Flex, Image, Text } from 'theme-ui'
import styled from '@emotion/styled'
import { keyframes, useTheme } from '@emotion/react'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const RotatingLogo = styled(Image)`
  animation: ${rotate} 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  padding: 1rem;
`

export const Loader = () => {
  const theme = useTheme() as any
  const logo = theme.logo || null

  return (
    <>
      <Flex sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {logo && (
          <RotatingLogo
            loading="lazy"
            src={logo}
            sx={{ width: [75, 75, 100] }}
          />
        )}
        <Text sx={{ width: '100%', textAlign: 'center' }}>loading...</Text>
      </Flex>
    </>
  )
}
