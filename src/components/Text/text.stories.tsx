import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs, text, boolean, number, color } from '@storybook/addon-knobs'

import { knobsFactory } from 'src/utils/knobs'

import Text from './'

import { withInfo } from '@storybook/addon-info'

const stories = storiesOf('UI/Text', module)

const defaultProps = {
  uppercase: false,
  regular: false,
  txtcenter: false,
  capitalize: false,
  bold: false,
  large: false,
  medium: false,
  small: false,
  superSmall: false,
  clipped: false,
  preLine: false,
  tags: false,
  auxiliary: false,
  paragraph: false,
  fontSize: 4,
}

const sortedProps = Object.keys(defaultProps)
  .sort()
  .reduce((acc, current) => {
    return { ...acc, [current]: defaultProps[current] }
  }, {})

stories.addDecorator(withKnobs)

stories.addDecorator(withInfo)
stories.addParameters({
  info: {
    inline: true,
    source: true,
  },
})

stories.add('default Text', () => (
  <Text {...knobsFactory({})}>{text('text', 'Change me')}</Text>
))

stories.add('Text as Label', () => (
  <div>
    <Text
      {...knobsFactory({
        as: 'label',
      })}
      htmlFor="awesome_input"
    >
      {text('Label', 'Awesome label: ')}
    </Text>
    <input type="text" name="awesome_input" id="awesome_input" />
  </div>
))

stories.add('playground Text', () => (
  <Text {...knobsFactory(sortedProps)}>
    {text('text', 'Lorem ipsum dolor sit.')}
  </Text>
))
