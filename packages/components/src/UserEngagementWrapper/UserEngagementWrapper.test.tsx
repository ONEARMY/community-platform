import '@testing-library/jest-dom/vitest';

import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { Default } from './UserEngagementWrapper.stories';

import type { JSX } from 'react';

describe('UserEngagementWrapper', () => {
  it('renders the children', () => {
    const DefaultComponent = Default as unknown as () => JSX.Element;
    const { getByText } = render(<DefaultComponent />);

    expect(getByText('Mark as useful')).toBeInTheDocument();
  });
});
