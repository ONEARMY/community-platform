import { Category } from './Category';

import type { Meta, StoryFn } from '@storybook/react-vite';
import type { Category as CategoryType } from 'oa-shared';

export default {
  title: 'Components/Category',
  component: Category,
} as Meta<typeof Category>;

export const Default: StoryFn<typeof Category> = () => (
  <Category
    category={
      {
        name: 'Label',
      } as CategoryType
    }
  />
);
