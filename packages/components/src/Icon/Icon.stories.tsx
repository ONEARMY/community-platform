import { Flex } from 'theme-ui';

import { glyphs, Icon } from './Icon';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/Icon',
  component: Icon,
} as Meta<typeof Icon>;

export const Default: StoryFn<typeof Icon> = () => <Icon glyph="delete" />;

export const Sizes: StoryFn<typeof Icon> = () => (
  <>
    {['xl', 'lg', 'md', 'sm', 'xs'].map((size, key) => (
      <Icon glyph="delete" key={key} size={size} />
    ))}
  </>
);

export const Available: StoryFn<typeof Icon> = () => (
  <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
    {Object.keys(glyphs).map((glyph: any, key) => (
      <a key={key} title={glyph}>
        <Icon glyph={glyph} size={30} />
      </a>
    ))}
  </Flex>
);

export const Colours: StoryFn<typeof Icon> = () => (
  <>
    {['#37ecba', '#47d5b9', '#57c1c5', '#72afd3'].map((color, key) => (
      <Icon glyph="delete" key={key} color={color} size={'lg'} />
    ))}
  </>
);
