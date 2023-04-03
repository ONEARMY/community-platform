/** @jsxImportSource theme-ui */
import { Box } from 'theme-ui'
import type { Result } from './types'

export interface Props {
  results: Result[]
  callback: any
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>
}

export const OsmGeocodingResultsList = (props: Props) => {
  const { results, callback, setShowResults } = props
  return (
    <Box
      data-cy="osm-geocoding-results"
      as="ul"
      sx={{
        background: 'white',
        padding: 0,
        position: 'relative',
        zIndex: 1,
        margin: '-2px 0 0',
        border: `2px solid black`,
        borderTopWidth: '1px',
        listStyle: 'none',
        borderRadius: 0,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
      }}
    >
      {results.map((result: Result, index: number) => (
        <Box
          as="li"
          sx={{
            paddingY: 1,
            paddingX: 2,
            lineHeight: 1.5,
            '&:hover': {
              background: 'softblue',
              cursor: 'pointer',
            },
          }}
          key={index}
          onClick={() => {
            setShowResults(false)
            if (callback) {
              callback(result)
            }
          }}
        >
          {result?.display_name}
        </Box>
      ))}
    </Box>
  )
}
