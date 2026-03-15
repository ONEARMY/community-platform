import '@testing-library/jest-dom/vitest';

import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { PaginationIcons } from './PaginationIcons';

describe('PaginationIcons', () => {
  it('renders the button with correct icon and title', () => {
    const { getByTestId, getByTitle } = render(
      <PaginationIcons
        hidden={false}
        ariaLabel='Navigate Previous page'
        title="Previous"
        directionIcon="chevron-left"
        onClick={() => {}}
      />,
    );

    expect(getByTestId('pagination-icon-chevron-left')).toBeInTheDocument();
    expect(getByTitle('Previous')).toBeInTheDocument();
  });

  it('hides the button when hidden prop is true', () => {
    const { queryByTestId } = render(
      <PaginationIcons
        ariaLabel="Navigate Previous page"
        hidden={true}
        title="Previous"
        directionIcon="chevron-left"
        onClick={() => {}}
      />,
    );

    const button = queryByTestId('pagination-icon-chevron-left');
    expect(button).not.toBeInTheDocument();
  });

  it('displays the button when hidden prop is false', () => {
    const { getByTestId } = render(
      <PaginationIcons
        ariaLabel='Navigate next page'
        hidden={false}
        title="Next"
        directionIcon="chevron-right"
        onClick={() => {}}
      />,
    );

    const button = getByTestId('pagination-icon-chevron-right');
    expect(button).toBeInTheDocument()
  });

  it('calls onClick handler when button is clicked', () => {
    const handleClick = vi.fn();
    const { getByTestId } = render(
      <PaginationIcons
        ariaLabel='Navigate next page'
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
        ariaLabel='Navigate next page'
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
