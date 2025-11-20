import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { SettingsFormProvider } from 'src/test/components/SettingsFormProvider';
import { describe, expect, it } from 'vitest';

import { PublicContactSection } from './PublicContact.section';

describe('PublicContact', () => {
  it('renders unchecked when isContactable is false', async () => {
    const isContactable = false;

    render(
      <SettingsFormProvider>
        <PublicContactSection isContactable={isContactable} />
      </SettingsFormProvider>,
    );

    expect(screen.getByTestId('isContactable')).not.toBeChecked();
  });

  it('renders checked when isContactable is true', async () => {
    const isContactable = true;

    render(
      <SettingsFormProvider>
        <PublicContactSection isContactable={isContactable} />
      </SettingsFormProvider>,
    );

    expect(screen.getByTestId('isContactable')).toBeChecked();
  });
});
