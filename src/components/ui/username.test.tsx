import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import type { Author } from 'oa-shared';
import type { ReactNode } from 'react';
import { createRoutesStub } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Username } from './username';
import {
  InvalidCountryCode,
  NoBadge,
  TwoBadges,
  WithAvatar,
  WithoutFlag,
} from './username.stories';

const renderInRouter = (ui: ReactNode) => {
  const Stub = createRoutesStub([{ path: '/', Component: () => <>{ui}</> }]);
  return render(<Stub />);
};

const user = { username: 'a-username', country: 'pt' } as Author;

describe('Username', () => {
  it('renders nothing without a username', () => {
    const { container } = renderInRouter(<Username user={{ country: 'pt' }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the known flag for a valid country', () => {
    const { getByTestId } = renderInRouter(<Username user={NoBadge.args!.user!} />);

    expect(getByTestId('Username: known flag')).toBeInTheDocument();
  });

  it('shows an unknown flag for empty value', () => {
    const { getByTestId } = renderInRouter(<Username user={WithoutFlag.args!.user!} />);

    expect(getByTestId('Username: unknown flag')).toBeInTheDocument();
  });

  it('shows an unknown flag for an invalid country code', () => {
    const { getByTestId } = renderInRouter(<Username user={InvalidCountryCode.args!.user!} />);

    expect(getByTestId('Username: unknown flag')).toBeInTheDocument();
  });

  it('shows each badge', () => {
    const { getByTestId } = renderInRouter(<Username user={TwoBadges.args!.user!} />);

    expect(getByTestId('Username: pro badge')).toBeInTheDocument();
    expect(getByTestId('Username: supporter badge')).toBeInTheDocument();
  });

  it('links to the profile in the same tab by default', () => {
    const { getByRole, getByTitle } = renderInRouter(<Username user={user} />);

    expect(getByRole('link')).toHaveAttribute('href', '/u/a-username');
    expect(getByRole('link')).toHaveAttribute('target', '_self');
    expect(getByRole('link').querySelector('[data-cy="Username"]')).toBeInTheDocument();
    expect(getByTitle('a-username')).toHaveTextContent('a-username');
  });

  it('uses the given link target', () => {
    const { getByRole } = renderInRouter(<Username user={user} target="_blank" />);

    expect(getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('renders without a link when isLink is false', () => {
    const { queryByRole, getByText } = renderInRouter(<Username user={user} isLink={false} />);

    expect(queryByRole('link')).not.toBeInTheDocument();
    expect(getByText('a-username')).toBeInTheDocument();
  });

  it('shows the avatar next to the linked name with showAvatar', () => {
    const { container, getByRole } = renderInRouter(
      <Username user={WithAvatar.args!.user!} showAvatar />,
    );

    expect(container.querySelector('[data-cy="authorAvatar"]')).toBeInTheDocument();
    expect(getByRole('link')).toHaveTextContent('a-username');
  });

  it('shows no avatar with showAvatar when the user has no photo', () => {
    const { container } = renderInRouter(<Username user={user} showAvatar />);

    expect(container.querySelector('[data-cy="authorAvatar"]')).not.toBeInTheDocument();
  });
});
