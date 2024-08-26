import { Banner, ExternalLink } from 'oa-components'
import { Text } from 'theme-ui'

interface IProps {
  showNewMap: boolean
  setShowNewMap: (show: boolean) => void
}

export const NewMapBanner = (props: IProps) => {
  const { showNewMap, setShowNewMap } = props
  const sx = { '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }
  return (
    <Banner
      variant="accent"
      sx={{ display: ['none', 'none', 'none', 'inherit'] }}
    >
      {showNewMap ? (
        <Text>
          🗺 We're still working on this.{' '}
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
          🗺 We're developing new map interface. Test it out!
        </Text>
      )}
    </Banner>
  )
}
