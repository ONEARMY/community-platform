import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { ElWithBeforeIcon } from './ElWithBeforeIcon'

import HeaderHowtoIcon from '../../../../src/assets/images/header-section/howto-header-icon.svg'

export default {
  title: 'Base Components/ElWithBeforeIcon',
  component: ElWithBeforeIcon,
} as ComponentMeta<typeof ElWithBeforeIcon>

export const Default: ComponentStory<typeof ElWithBeforeIcon> = () => (
  <ElWithBeforeIcon icon={HeaderHowtoIcon}>
    <p>Element</p>
  </ElWithBeforeIcon>
)

export const Sizes: ComponentStory<typeof ElWithBeforeIcon> = (args) => (
  <ElWithBeforeIcon {...args} icon={HeaderHowtoIcon}>
    <p>Element</p>
  </ElWithBeforeIcon>
)
