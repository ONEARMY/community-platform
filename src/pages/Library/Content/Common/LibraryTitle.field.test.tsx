import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';

import { LibraryFormProvider } from './LibraryFormProvider';
import { LibraryTitleField } from './LibraryTitle.field';

describe('LibraryTitleField', () => {
  it('renders', async () => {
    render(
      <LibraryFormProvider>
        <LibraryTitleField />
      </LibraryFormProvider>,
    );

    await screen.findByText('0 / 50');
  });
});
