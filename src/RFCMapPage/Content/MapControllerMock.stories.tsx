import { ComponentStory, ComponentMeta } from '@storybook/react';

import { IMapControllerProps } from '../types'
import { getRandomTestsPins } from './library/testHelpers'
import MockLeafletMap from './view/LeafletMap/MockLeafletMap';

import MapController from './MapController'

const MockDatabaseProvider = ({ mapPins, handleClickOnPin }: IMapControllerProps) => {
  return (
    <MapController mapPins={mapPins} handleClickOnPin={handleClickOnPin} >
      <MockLeafletMap zoom={4} center={[0,0]} style={{height: "100vh"}} iconUrlBase='assets/icons/' />
    </MapController>
  )
}

export default {
  title: 'RFC/Map/MapController/Mock',
  component: MockDatabaseProvider,
} as ComponentMeta<typeof MockDatabaseProvider>;

const Template: ComponentStory<typeof MockDatabaseProvider> = (args) => <MockDatabaseProvider {...args} />

export const Basic = Template.bind({});
Basic.args = {
  mapPins: getRandomTestsPins(10),
  handleClickOnPin: (id) => console.log('mock.handleClickOnPin', id) 
};
Basic.storyName = 'Mock'