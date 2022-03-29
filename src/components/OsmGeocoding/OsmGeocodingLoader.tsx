import styled from '@emotion/styled';
import Text from 'src/components/Text'

const Loader = styled('div')`
    background: ${(prop) => prop.theme.colors.white};
    position: relative;
    z-index: 1;
    padding: 0;
    margin: -2px 0 0;
    padding: ${(prop) => prop.theme.space[1]}px ${(prop) => prop.theme.space[2]}px;
    border: 2px solid ${(prop) => prop.theme.colors.black};
    border-top-width: 1px;
    line-height: 1.5;
    border-radius: 0 0 ${(prop)=>prop.theme.radii[1]}px ${(prop)=>prop.theme.radii[1]}px;
`
export const OsmGeocodingLoader = (
) => {
  return (
    <Loader>
      <Text small>Fetching results from Open Street Map</Text>
    </Loader>
  )
}

export default OsmGeocodingLoader;