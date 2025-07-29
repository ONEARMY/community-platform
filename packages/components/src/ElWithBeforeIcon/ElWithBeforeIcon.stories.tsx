import HeaderHowtoIcon from '../../../../src/assets/images/header-section/howto-header-icon.svg'
import { ElWithBeforeIcon } from './ElWithBeforeIcon'

import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/ElWithBeforeIcon',
  component: ElWithBeforeIcon,
} as Meta<typeof ElWithBeforeIcon>

export const Default: StoryFn<typeof ElWithBeforeIcon> = () => (
  <ElWithBeforeIcon icon={HeaderHowtoIcon}>
    <p>Element</p>
  </ElWithBeforeIcon>
)

export const Sizes: StoryObj<typeof ElWithBeforeIcon> = {
  render: (args) => (
    <ElWithBeforeIcon {...args} icon={HeaderHowtoIcon}>
      <p>Element</p>
    </ElWithBeforeIcon>
  ),
}
