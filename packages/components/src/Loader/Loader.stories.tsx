import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { Loader } from './Loader'

import projectKampLogo from '../../../../src/assets/images/themes/project-kamp/project-kamp-header.png'

export default {
  title: 'Base Components/Loader',
  component: Loader,
} as ComponentMeta<typeof Loader>

export const Default: ComponentStory<typeof Loader> = () => (
  <Loader logo={projectKampLogo} />
)
