import { ComponentStory, ComponentMeta } from '@storybook/react';

import { IMapControllerProps } from '../types'
import { getRandomTestsPins } from './library/testHelpers'
import LeafletMap from './view/LeafletMap/LeafletMap';

import MapController from './MapController'

const MockDatabaseProvider = ({ mapPins, handleClickOnPin }: IMapControllerProps) => {
  return (
    <MapController mapPins={mapPins} handleClickOnPin={handleClickOnPin} >
      <LeafletMap zoom={2} center={[51.0,19.0]} style={{height: "100vh"}} iconUrlBase='assets/icons/' />
    </MapController>
  )
}

export default {
  title: 'RFC/Map/MapController/Leaflet',
  component: MockDatabaseProvider,
} as ComponentMeta<typeof MockDatabaseProvider>;

const Template: ComponentStory<typeof MockDatabaseProvider> = (args) => <MockDatabaseProvider {...args} />

export const Basic = Template.bind({});
Basic.args = {
  mapPins: getRandomTestsPins(300),
  handleClickOnPin: (id:string) => console.log('mock.handleClickOnPin', id)
};
Basic.storyName = 'Leaflet'