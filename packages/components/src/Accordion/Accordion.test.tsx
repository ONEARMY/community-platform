import '@testing-library/jest-dom/vitest';

import { act, screen } from '@testing-library/react';
import { Text } from 'theme-ui';
import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('displays the accordion body on click', () => {
    const { getByText } = render(
      <Accordion title="Accordion Title">
        <Text>Now you see me!</Text>
      </Accordion>,
    );
    const accordionTitle = getByText('Accordion Title');
    expect(screen.queryByText('Now you see me!')).not.toBeInTheDocument();

    act(() => {
      accordionTitle.click();
    });

    expect(getByText('Now you see me!')).toBeInTheDocument();
  });
});
