import { storiesOf } from '@storybook/react'
import * as React from 'react'
import Color from '../components/Color'
import theme from '../themes/styled.theme'

const stories = storiesOf('Theme|Colors', module)

const colors = Object.keys(theme.colors).map(key => (
  <Color name={key} color={theme.colors[key]} />
))

stories.add('List', () => <React.Fragment>{colors}</React.Fragment>)
