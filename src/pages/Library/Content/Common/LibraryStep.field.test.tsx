import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { LibraryFormProvider } from './LibraryFormProvider';
import { LibraryStepField } from './LibraryStep.field';

describe('LibraryStepField', () => {
  it('renders', async () => {
    const props = {
      name: '',
      index: 0,
      images: [],
      existingImages: [],
      onDelete: vi.fn(() => null),
      moveStep: vi.fn(() => null),
      removeExistingImage: vi.fn(() => null),
    };

    render(
      <LibraryFormProvider>
        <LibraryStepField {...props} />
      </LibraryFormProvider>,
    );

    await screen.findByText('Step 1 *');
  });
});
