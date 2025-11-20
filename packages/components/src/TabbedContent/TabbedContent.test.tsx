import '@testing-library/jest-dom/vitest';

import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { Default } from './TabbedContent.stories';

import type { JSX } from 'react';

const DefaultComponent = Default as unknown as () => JSX.Element;

describe('TabbedContent', () => {
  it('basic interaction', () => {
    const wrapper = render(<DefaultComponent />);

    expect(wrapper.getByText('Tab #1')).toBeVisible();

    expect(() => wrapper.getByText('Tab Panel #2')).toThrow();
  });

  it('switches between tabs', () => {
    const wrapper = render(<DefaultComponent />);

    act(() => {
      wrapper.getByText('Tab #2').click();
    });

    expect(wrapper.getByText('Tab #1')).toBeVisible();

    expect(() => wrapper.getByText('Tab Panel #1')).toThrow();
    expect(wrapper.getByText('Tab Panel #2')).toBeInTheDocument();
  });
});
