import type { Result } from './OsmGeocoding'
import styled from '@emotion/styled';

interface Props {
    results: Result[],
    callback: any,
    setShowResults: React.Dispatch<React.SetStateAction<boolean>>,
}

const List = styled('ul')`
    background: ${(prop) => prop.theme.colors.white};
    padding: 0;
    position: relative;
    z-index: 1;
    margin: -2px 0 0;
    border: 2px solid ${(prop) => prop.theme.colors.black};
    border-top-width: 1px;
    border-radius: 0 0 ${(prop)=>prop.theme.radii[1]}px ${(prop)=>prop.theme.radii[1]}px;
`

const ListItem = styled('li')`
    list-style: none;
    line-height: 1.5;
    padding: ${(prop) => prop.theme.space[1]}px ${(prop) => prop.theme.space[2]}px;

    &:hover {
        background: ${(prop) => prop.theme.colors.softblue};
        cursor: pointer;
    }
`

export const OsmGeocodingResultsList = (
  props: Props,
) => {
    const {results, callback, setShowResults} = props;
  return (
    <List data-cy="osm-geocoding-results">
      {results.map((result: Result, index: number) => (
        <ListItem
          key={index}
          onClick={() => {
            setShowResults(false)
            if (callback) {
              callback(result)
            }
          }}
        >
          {result?.display_name}
        </ListItem>
      ))}
    </List>
  )
}

export default OsmGeocodingResultsList;