import '@testing-library/jest-dom/vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { fireEvent, render } from '@testing-library/react';
import { FactoryUser } from 'src/test/factories/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { checklist } from './labels';
import { NewMemberChecklist } from './NewMemberChecklist';

const mocks = vi.hoisted(() => ({
  profile: undefined as unknown,
  isComplete: false as boolean | null,
}));

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({
    profile: mocks.profile,
    isComplete: mocks.isComplete,
  }),
}));

const renderChecklist = () => {
  const router = createMemoryRouter([{ path: '/', element: <NewMemberChecklist /> }]);
  return render(<RouterProvider router={router} />);
};

describe('NewMemberChecklist', () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.profile = FactoryUser({ id: 7 });
    mocks.isComplete = false;
  });

  it('is hidden for logged out visitors', () => {
    mocks.profile = undefined;
    const { container } = renderChecklist();

    expect(container).toBeEmptyDOMElement();
  });

  it('is hidden for organisation profiles', () => {
    const profile = FactoryUser({ id: 7 });
    mocks.profile = { ...profile, type: { ...profile.type, isSpace: true } };
    const { container } = renderChecklist();

    expect(container).toBeEmptyDOMElement();
  });

  it('is hidden once dismissed by this profile', () => {
    localStorage.setItem('newMemberChecklistDismissed_7', 'true');
    const { container } = renderChecklist();

    expect(container).toBeEmptyDOMElement();
  });

  it('is still shown when a different profile dismissed it', () => {
    localStorage.setItem('newMemberChecklistDismissed_8', 'true');
    const { getByText } = renderChecklist();

    expect(getByText(checklist.title)).toBeInTheDocument();
  });

  it('links to the profile settings while the profile is incomplete', () => {
    const { getByRole, getByText, queryByText } = renderChecklist();

    expect(getByText(checklist.title)).toBeInTheDocument();
    expect(
      getByText(`${checklist.nextStep}: ${checklist.actions.completeProfile}`),
    ).toBeInTheDocument();
    expect(getByRole('link', { name: checklist.actions.completeProfile })).toHaveAttribute(
      'href',
      '/settings',
    );
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
    expect(queryByText(checklist.done)).not.toBeInTheDocument();
  });

  it('shows the done button once the profile is complete', () => {
    mocks.isComplete = true;
    const { getByRole, getByText, queryByRole } = renderChecklist();

    expect(
      getByText(`${checklist.nextStep}: ${checklist.actions.shareWithFriend}`),
    ).toBeInTheDocument();
    expect(queryByRole('link', { name: checklist.actions.completeProfile })).not.toBeInTheDocument();
    expect(getByText(checklist.actions.completeProfile)).toHaveClass('line-through');
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    expect(getByText(checklist.done)).toBeInTheDocument();
  });

  it('hides itself and remembers the dismissal', () => {
    mocks.isComplete = true;
    const { container, getByText } = renderChecklist();

    fireEvent.click(getByText(checklist.done));

    expect(container).toBeEmptyDOMElement();
    expect(localStorage.getItem('newMemberChecklistDismissed_7')).toBe('true');
  });
});
