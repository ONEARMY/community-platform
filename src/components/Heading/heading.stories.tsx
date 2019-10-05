import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs, text, boolean, number, color } from '@storybook/addon-knobs'

import theme from 'src/themes/styled.theme'
import { knobsFactory } from 'src/utils/knobs'

import Heading from './'

import { withInfo } from '@storybook/addon-info'

const stories = storiesOf('UI/Heading', module)

stories.addDecorator(withKnobs)

stories.addDecorator(withInfo)
stories.addParameters({
  info: {
    inline: true,
    source: true,
  },
})

stories.add('default Heading', () => (
  <Heading
    {...knobsFactory({
      theme,
      large: true,
      medium: false,
      small: false,
      clipped: false,
      color: 'black',
    })}
  >
    {text('text', 'Lorem ipsum dolor sit.')}
  </Heading>
))
