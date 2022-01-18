import { ComponentStory, ComponentMeta } from '@storybook/react'
import LeafletMap from './LeafletMap'
import { IPinProps } from '../../../types'
import { getRandomTestsPins } from '../../library/testHelpers'
import { getFilters, groupPins } from '../../library/utils'
export default {
  title: 'RFC/Map/View/LeafletMap',
  component: LeafletMap,
} as ComponentMeta<typeof LeafletMap>;

const Template: ComponentStory<typeof LeafletMap> = (args) => <LeafletMap {...args} />

const filteredPins:IPinProps[] = getRandomTestsPins(300).map(p => Object.assign({}, p, {icon: `map-${p.type}.svg`}))

export const Basic = Template.bind({});
Basic.args = { 
  filteredPins,
  filters: getFilters(groupPins(filteredPins)),
  onChange: (e) => console.log(e), 
  zoom: 2, 
  center: [0, 0], // The Null Island 
  style: { height: "100vh" }, 
  iconUrlBase: 'assets/icons/' 
};
Basic.storyName = 'LeafletMap and MapControls (only view)';
