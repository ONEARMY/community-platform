import type { ComponentStory, ComponentMeta } from '@storybook/react'
import { glyphs } from '../Icon/Icon'
import { Button } from './Button'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const sizeOptions = [
  {
    small: true,
    label: 'Small',
  },
  {
    label: 'Default',
  },
  {
    large: true,
    label: 'Large',
  },
]

export const Basic: ComponentStory<typeof Button> = () => (
  <Button>Button Text</Button>
)

export const Disabled: ComponentStory<typeof Button> = () => (
  <>
    <Button disabled>Disabled</Button>
    <Button icon="delete" disabled>
      Disabled
    </Button>
  </>
)

export const Primary: ComponentStory<typeof Button> = () => (
  <>
    <Button variant={'primary'}>Primary</Button>
    <Button icon="delete" variant={'primary'}>
      Primary
    </Button>
    {sizeOptions.map((v, k) => (
      <Button key={k} variant={'primary'} {...v}>
        {v.label}
      </Button>
    ))}
  </>
)

export const Secondary: ComponentStory<typeof Button> = () => (
  <>
    <Button variant={'secondary'}>Secondary</Button>
    <Button icon="delete" variant={'secondary'}>
      Secondary
    </Button>
    {sizeOptions.map((v, k) => (
      <Button key={k} variant={'secondary'} {...v}>
        {v.label}
      </Button>
    ))}
  </>
)

export const Subtle: ComponentStory<typeof Button> = () => (
  <>
    <Button variant={'subtle'}>Subtle</Button>
    <Button variant={'subtle'} icon="account-circle">
      Subtle
    </Button>
    {sizeOptions.map((v, k) => (
      <Button key={k} variant={'subtle'} {...v}>
        {v.label}
      </Button>
    ))}
  </>
)

export const Outline: ComponentStory<typeof Button> = () => (
  <>
    <Button variant={'outline'}>Outline</Button>
    <Button variant={'outline'} icon="account-circle">
      Outline
    </Button>
    {sizeOptions.map((v, k) => (
      <Button key={k} variant={'outline'} {...v}>
        {v.label}
      </Button>
    ))}
  </>
)

export const Small: ComponentStory<typeof Button> = () => (
  <>
    <Button small={true}>Small Button</Button>
    <Button small={true} icon="delete">
      Small Button with Icon
    </Button>
  </>
)

export const Large: ComponentStory<typeof Button> = () => (
  <>
    <Button large={true}>Large Button</Button>
    <Button large={true} icon="delete">
      Large Button with Icon
    </Button>
  </>
)

export const IconOnly: ComponentStory<typeof Button> = () => (
  <>
    <Button large={true} icon="delete" showIconOnly={true}>
      Icon Button with hidden text
    </Button>
  </>
)

export const Icons: ComponentStory<typeof Button> = () => (
  <>
    {sizeOptions.map((size) =>
      ['primary', 'secondary', 'outline'].map((variant) =>
        Object.keys(glyphs).map((glyph: any, key) => (
          <Button icon={glyph} key={key} {...size} variant={variant}>
            {size.label} with Icon
          </Button>
        )),
      ),
    )}
  </>
)
