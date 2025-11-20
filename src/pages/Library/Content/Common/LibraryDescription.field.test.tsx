import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';

import { LibraryDescriptionField } from './LibraryDescription.field';
import { LibraryFormProvider } from './LibraryFormProvider';

describe('HowtoFieldStepsDescription', () => {
  it('renders', async () => {
    render(
      <LibraryFormProvider>
        <LibraryDescriptionField />
      </LibraryFormProvider>,
    );

    await screen.findByText('Short description *');
  });
  // Will add behavioural test when #2698 is merged in; 1000 character cap
});
