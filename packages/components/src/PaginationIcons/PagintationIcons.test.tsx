import '@testing-library/jest-dom/vitest';

import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { PaginationIcons } from './PaginationIcons';

describe('PaginationIcons', () => {
  it('renders the button with correct icon and title', () => {
    const { getByTestId, getByTitle } = render(
      <PaginationIcons
        hidden={false}
        title="Previous"
        directionIcon="chevron-left"
        onClick={() => {}}
      />,
    );

    expect(getByTestId('pagination-icon-chevron-left')).toBeInTheDocument();
    expect(getByTitle('Previous')).toBeInTheDocument();
  });

  it('hides the button when hidden prop is true', () => {
    const { getByTestId } = render(
      <PaginationIcons
        hidden={true}
        title="Previous"
        directionIcon="chevron-left"
        onClick={() => {}}
      />,
    );

    const button = getByTestId('pagination-icon-chevron-left');
    expect(button).toHaveStyle('display: none');
  });

  it('displays the button when hidden prop is false', () => {
    const { getByTestId } = render(
      <PaginationIcons
        hidden={false}
        title="Next"
        directionIcon="chevron-right"
        onClick={() => {}}
      />,
    );

    const button = getByTestId('pagination-icon-chevron-right');
    expect(button).toHaveStyle('display: flex');
  });

  it('calls onClick handler when button is clicked', () => {
    const handleClick = vi.fn();
    const { getByTestId } = render(
      <PaginationIcons
        hidden={false}
        title="Next"
        directionIcon="chevron-right"
        onClick={handleClick}
      />,
    );

    getByTestId('pagination-icon-chevron-right').click();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('renders different icon types', () => {
    const icons: Array<
      'chevron-left' | 'chevron-right' | 'double-arrow-left' | 'double-arrow-right'
    > = ['chevron-left', 'chevron-right', 'double-arrow-left', 'double-arrow-right'];

    icons.forEach((icon) => {
      const { getByTestId } = render(
        <PaginationIcons
          hidden={false}
          title={`Icon: ${icon}`}
          directionIcon={icon}
          onClick={() => {}}
        />,
      );

      expect(getByTestId(`pagination-icon-${icon}`)).toBeInTheDocument();
    });
  });
});
