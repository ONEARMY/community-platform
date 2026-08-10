import '@testing-library/jest-dom/vitest';

import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { Button } from './Button';

const DEFAULT_ICON_SIZE = '16px';

describe('Button', () => {
  it('renders the icon at the default size when iconSize is omitted', () => {
    const { getByRole } = render(<Button icon="delete">Delete</Button>);

    const iconWrapper = getByRole('img', { hidden: true }).parentElement;

    expect(iconWrapper).toHaveStyle(`width: ${DEFAULT_ICON_SIZE}`);
    expect(iconWrapper).toHaveStyle(`height: ${DEFAULT_ICON_SIZE}`);
  });

  it('renders the icon at the given size when iconSize is provided', () => {
    const { getByRole } = render(
      <Button icon="delete" iconSize={20}>
        Delete
      </Button>,
    );

    const iconWrapper = getByRole('img', { hidden: true }).parentElement;

    expect(iconWrapper).toHaveStyle('width: 20px');
    expect(iconWrapper).toHaveStyle('height: 20px');
  });

  it('does not pass iconSize through to the underlying button element', () => {
    const { getByRole } = render(
      <Button icon="delete" iconSize={20}>
        Delete
      </Button>,
    );

    expect(getByRole('button')).not.toHaveAttribute('iconSize');
  });
});
