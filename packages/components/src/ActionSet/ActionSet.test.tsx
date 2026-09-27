import '@testing-library/jest-dom/vitest';

import { fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { ActionSet } from './ActionSet';

const DEFAULT_MENU_MIN_WIDTH = '200px';

const getMenuCard = (menuItem: HTMLElement) => menuItem.parentElement?.parentElement;

describe('ActionSet', () => {
  it('only renders the menu once the trigger is clicked', () => {
    const { getByRole, queryByText, getByText } = render(
      <ActionSet itemType="RemakeItem">
        <span key="edit">Edit</span>
        <span key="delete">Delete</span>
      </ActionSet>,
    );

    expect(queryByText('Edit')).toBeNull();

    fireEvent.click(getByRole('button'));

    expect(getByText('Edit')).toBeInTheDocument();
  });

  it('renders the menu at the default min width when menuMinWidth is omitted', () => {
    const { getByRole, getByText } = render(
      <ActionSet itemType="RemakeItem">
        <span key="edit">Edit</span>
        <span key="delete">Delete</span>
      </ActionSet>,
    );

    fireEvent.click(getByRole('button'));

    expect(getMenuCard(getByText('Edit'))).toHaveStyle(`min-width: ${DEFAULT_MENU_MIN_WIDTH}`);
  });

  it('renders the menu at the given min width when menuMinWidth is provided', () => {
    const { getByRole, getByText } = render(
      <ActionSet itemType="RemakeItem" menuMinWidth="320px">
        <span key="edit">Edit</span>
        <span key="delete">Delete</span>
      </ActionSet>,
    );

    fireEvent.click(getByRole('button'));

    expect(getMenuCard(getByText('Edit'))).toHaveStyle('min-width: 320px');
  });
});
