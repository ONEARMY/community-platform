import { Box } from 'theme-ui';

import { VerticalList } from './VerticalList.client';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Components/VerticalList',
  component: VerticalList,
} as Meta<typeof VerticalList>;

export const Default: StoryFn<typeof VerticalList> = () => {
  const items = ['hello', 'world!', '...', 'Yeah,', 'you!'];
  return (
    <div style={{ width: '500px' }}>
      <VerticalList>
        {items.map((item, index) => (
          <Box
            key={index}
            sx={{
              width: '200px',
              height: '200px',
              border: '2px solid #000',
            }}
          >
            {item}
          </Box>
        ))}
      </VerticalList>
    </div>
  );
};
