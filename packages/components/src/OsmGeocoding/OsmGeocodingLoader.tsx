import { Box, Text } from 'theme-ui'

export const OsmGeocodingLoader = () => {
  return (
    <>
      <Box
        sx={{
          background: 'white',
          position: 'relative',
          zIndex: 1,
          marginTop: '-2px',
          paddingX: 2,
          paddingY: 1,
          border: '2px solid',
          borderColor: 'black',
          borderTopWidth: '1px',
          lineHeight: 1.5,
          borderBottomLeftRadius: 1,
          borderBottomRightRadius: 1,
        }}
      >
        <Text sx={{ fontSize: 1 }}>Fetching results from Open Street Map</Text>
      </Box>
    </>
  )
}
