import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert', () => {
  it('renders as an alert landmark with its content', () => {
    const { getByRole } = render(
      <Alert variant="info">
        <AlertDescription>An information message</AlertDescription>
      </Alert>,
    );

    expect(getByRole('alert')).toHaveTextContent('An information message');
  });

  it('applies the legacy palette per variant', () => {
    const variants = {
      success: 'bg-[#00c3a9]',
      destructive: 'bg-[#f58d8e]',
      info: 'bg-[#e2edf7]',
      warning: 'bg-[#fee77b]',
    } as const;

    for (const [variant, className] of Object.entries(variants)) {
      const { getByRole, unmount } = render(
        <Alert variant={variant as keyof typeof variants}>
          <AlertDescription>Message</AlertDescription>
        </Alert>,
      );

      expect(getByRole('alert')).toHaveClass(className);
      unmount();
    }
  });

  it('renders title and description slots', () => {
    const { getByText } = render(
      <Alert variant="info">
        <AlertTitle>Moderator Feedback</AlertTitle>
        <AlertDescription>Please add a cover image</AlertDescription>
      </Alert>,
    );

    expect(getByText('Moderator Feedback')).toHaveAttribute('data-slot', 'alert-title');
    expect(getByText('Please add a cover image')).toHaveAttribute(
      'data-slot',
      'alert-description',
    );
  });

  it('forwards className and other props', () => {
    const { getByRole } = render(
      <Alert variant="warning" className="text-left" data-cy="emptyProfileMessage">
        <AlertDescription>Message</AlertDescription>
      </Alert>,
    );

    expect(getByRole('alert')).toHaveClass('text-left');
    expect(getByRole('alert')).toHaveAttribute('data-cy', 'emptyProfileMessage');
  });
});
