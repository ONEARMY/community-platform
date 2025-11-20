import { Card, Checkbox, Text } from 'theme-ui';

import { GridForm } from './GridForm';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/GridForm',
  component: GridForm,
} as Meta<typeof GridForm>;

export const Default: StoryFn<typeof GridForm> = () => (
  <Card sx={{ maxWidth: '600px', padding: 2 }}>
    <GridForm
      heading="The heading area"
      fields={[
        {
          glyph: 'discussion',
          name: 'An Odd Row',
          description: 'With a description.',
          component: <Text sx={{ textAlign: 'center' }}>Any old component</Text>,
        },
        {
          glyph: 'plastic',
          name: 'An Even Row',
          description: 'With a description.',
          component: <Checkbox />,
        },
      ]}
    />
  </Card>
);
