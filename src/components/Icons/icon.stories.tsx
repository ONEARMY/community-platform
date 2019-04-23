import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs, select } from '@storybook/addon-knobs'

import Icon, { glyphs } from './'

import { wInfo } from '../../../.storybook/wInfo'

const stories = storiesOf('UI/Icons', module)
stories.addDecorator(withKnobs)

const sizes = {
  XSmall: 8,
  Small: 16,
  Medium: 32,
  Large: 48,
  XLarge: 64,
}

Object.keys(glyphs).map(glyph =>
  stories.add(
    glyph,
    wInfo()(() => (
      <Icon glyph={glyph} size={select('Size', sizes, 32, 'iconSizes')} />
    )),
  ),
)
