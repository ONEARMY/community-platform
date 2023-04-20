import type { StoryFn, Meta } from '@storybook/react'
import { OsmGeocoding } from './OsmGeocoding'
import { OsmGeocodingResultsList } from './OsmGeocodingResultsList'

export default {
  title: 'Components/OsmGeocoding',
  component: OsmGeocoding,
} as Meta<typeof OsmGeocoding>

export const Default: StoryFn<typeof OsmGeocoding> = () => (
  <OsmGeocoding loading={false} />
)

export const Loading: StoryFn<typeof OsmGeocoding> = () => (
  <OsmGeocoding loading />
)

export const ResultsList: StoryFn<typeof OsmGeocodingResultsList> = () => (
  <OsmGeocodingResultsList
    results={[
      {
        place_id: 282375433,
        licence:
          'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
        osm_type: 'relation',
        osm_id: 2658749,
        boundingbox: ['53.0035627', '53.0546835', '5.6146842', '5.7246007'],
        lat: '53.033548',
        lon: '5.6611029',
        display_name: 'Sneek, Súdwest-Fryslân, Frisia, Netherlands',
        class: 'boundary',
        type: 'administrative',
        importance: 0.5823870580190648,
        icon: 'https://nominatim.openstreetmap.org/ui/mapicons//poi_boundary_administrative.p.20.png',
      },
      {
        place_id: 79535975,
        licence:
          'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
        osm_type: 'node',
        osm_id: 7606839826,
        boundingbox: ['53.0276201', '53.0376201', '5.6468895', '5.6568895'],
        lat: '53.0326201',
        lon: '5.6518895',
        display_name:
          'Sneek, Doctor Boumaweg, Sneek, Súdwest-Fryslân, Frisia, Netherlands, 8601GG, Netherlands',
        class: 'railway',
        type: 'station',
        importance: 0.406301518086152,
        icon: 'https://nominatim.openstreetmap.org/ui/mapicons//transport_train_station2.p.20.png',
      },
      {
        place_id: 208556,
        licence:
          'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
        osm_type: 'node',
        osm_id: 47984318,
        boundingbox: ['53.1169959', '53.1170959', '5.8099395', '5.8100395'],
        lat: '53.1170459',
        lon: '5.8099895',
        display_name:
          'Sneek, A32, Idaerd, Leeuwarden, Frisia, Netherlands, 9007SE, Netherlands',
        class: 'highway',
        type: 'motorway_junction',
        importance: 0.101,
      },
      {
        place_id: 210270,
        licence:
          'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright',
        osm_type: 'node',
        osm_id: 47965735,
        boundingbox: ['53.1071958', '53.1072958', '5.8151597', '5.8152597'],
        lat: '53.1072458',
        lon: '5.8152097',
        display_name:
          'Sneek, A32, Idaerd, Leeuwarden, Frisia, Netherlands, 9007SH, Netherlands',
        class: 'highway',
        type: 'motorway_junction',
        importance: 0.101,
      },
    ]}
    callback={undefined}
    setShowResults={() => null}
  />
)
