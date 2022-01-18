import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ICheckboxProps } from '../../../types'
import Checkbox from './Checkbox'

const fakeData: ICheckboxProps = {
  name: 'prueba',
  label: 'Checkbox de prueba',
  checked: false,
  onChange: (data) => console.log(data)
}

export default {
  title: 'RFC/Map/View/Checkbox',
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const Basic = Template.bind({});
Basic.args = fakeData;
Basic.storyName = 'Checkbox'
