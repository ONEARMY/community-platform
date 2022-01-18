import { ComponentStory, ComponentMeta } from '@storybook/react';

import { IMapControlsProps } from '../../../types'
import MapControls from './MapControls'

import { getRandomTestsPins } from '../../library/testHelpers'
import { getFilters, groupPins } from '../../library/utils'

const fakeData: IMapControlsProps = {
  filters: getFilters(groupPins(getRandomTestsPins(10))),
  onChange: (data) => console.log(data)
}

export default {
  title: 'RFC/Map/View/MapControls',
  component: MapControls,
} as ComponentMeta<typeof MapControls>;

const Template: ComponentStory<typeof MapControls> = (args) => <MapControls {...args} />;

export const Basic = Template.bind({});
Basic.args = fakeData;
Basic.storyName = 'MapControls'