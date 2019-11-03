import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs, text, boolean, number, color } from '@storybook/addon-knobs'

import theme from 'src/themes/styled.theme'
import { knobsFactory } from 'src/utils/knobs'

import Heading from './'

import { withInfo } from '@storybook/addon-info'

const stories = storiesOf('UI/Heading', module)

stories.addDecorator(withKnobs)

// stories.addDecorator(withInfo)
stories.addParameters({
  info: {
    inline: true,
    source: true,
  },
})

stories.add('default Heading', () => (
  <Heading>
    {text(
      'text',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit architecto ad inventore animi consequatur deserunt eaque eos excepturi, aliquam iusto placeat quam numquam debitis vel eligendi? A earum voluptates vel!',
    )}
  </Heading>
))

stories.add('playground Heading', () => (
  <Heading
    {...knobsFactory({
      large: true,
      medium: false,
      small: false,
      clipped: false,
      color: 'black',
      theme,
    })}
  >
    {text(
      'text',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit architecto ad inventore animi consequatur deserunt eaque eos excepturi, aliquam iusto placeat quam numquam debitis vel eligendi? A earum voluptates vel!',
    )}
  </Heading>
))
