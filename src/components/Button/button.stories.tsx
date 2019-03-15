import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'

import { Button } from './'

import { wInfo } from '../../../.storybook/wInfo'

const stories = storiesOf('UI/Buttons', module)

stories.addDecorator(withKnobs)

stories.add(
  'Default button',
  wInfo()(() => (
    <Button disabled={boolean('Disabled', false)} onClick={action('onClick')}>
      {text('Label', 'Edit me')}
    </Button>
  )),
)
stories.add(
  'Primary button with Icon',
  wInfo()(() => (
    <Button
      icon={'add'}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
    >
      {text('Label', 'Edit me')}
    </Button>
  )),
)
stories.add(
  'Outline button',
  wInfo()(() => (
    <Button
      variant={'outline'}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
    >
      {text('Label', 'Edit me')}
    </Button>
  )),
)
stories.add(
  'Outline button with Icon',
  wInfo()(() => (
    <Button
      variant={'outline'}
      icon={'add'}
      disabled={boolean('Disabled', false)}
      onClick={action('onClick')}
    >
      {text('Label', 'Edit me')}
    </Button>
  )),
)
