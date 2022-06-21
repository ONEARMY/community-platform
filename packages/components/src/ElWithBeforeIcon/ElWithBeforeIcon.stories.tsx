import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { ElWithBeforeIcon } from './ElWithBeforeIcon'

import HeaderHowtoIcon from '../../../../src/assets/images/header-section/howto-header-icon.svg'

export default {
  title: 'Base Components/ElWithBeforeIcon',
  component: ElWithBeforeIcon,
} as ComponentMeta<typeof ElWithBeforeIcon>

export const Default: ComponentStory<typeof ElWithBeforeIcon> = () => (
  <ElWithBeforeIcon IconUrl={HeaderHowtoIcon}>
    <p>Element</p>
  </ElWithBeforeIcon>
)

export const Sizes: ComponentStory<typeof ElWithBeforeIcon> = ({
  height,
  width,
}) => (
  <ElWithBeforeIcon IconUrl={HeaderHowtoIcon} height={height} width={width}>
    <p>Element</p>
  </ElWithBeforeIcon>
)
