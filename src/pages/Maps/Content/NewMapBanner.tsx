import { Banner, ExternalLink, Icon } from 'oa-components'
import { Flex, Text } from 'theme-ui'

interface IProps {
  showNewMap: boolean
  setShowNewMap: (show: boolean) => void
}

export const NewMapBanner = (props: IProps) => {
  const { showNewMap, setShowNewMap } = props
  const sx = { '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }

  return (
    <Banner variant="accent">
      <Flex sx={{ justifyItems: 'center', gap: 1 }}>
        <Icon glyph="map" />
        {showNewMap ? (
          <Text>
            We're still working on this.{' '}
            <ExternalLink
              href="https://github.com/ONEARMY/community-platform"
              sx={{ ...sx, color: 'black', fontWeight: 'bold' }}
            >
              Help us develop it
            </ExternalLink>{' '}
            <Text onClick={() => setShowNewMap(false)} sx={sx}>
              or go back to the old one!
            </Text>
          </Text>
        ) : (
          <Text onClick={() => setShowNewMap(true)} sx={sx}>
            We're developing new map interface. Test it out!
          </Text>
        )}
      </Flex>
    </Banner>
  )
}
