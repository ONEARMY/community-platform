import '@testing-library/jest-dom/vitest';

import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProfileContributions } from './ProfileContributions';

import type { Question } from 'oa-shared';

const mockAnswers: Partial<Question>[] = [
  {
    id: 1,
    slug: 'question-doc-1',
    title: 'Question Doc 1',
    usefulCount: 2,
    acceptedAnswerId: 5,
  },
];

describe('ProfileContributions', () => {
  it('renders only the answers section, linking to the accepted comment', () => {
    render(
      <MemoryRouter>
        <ProfileContributions docs={{ projects: [], research: [], answers: mockAnswers }} username="test-user" />
      </MemoryRouter>,
    );
    expect(screen.queryByText('Library')).not.toBeInTheDocument();
    expect(screen.queryByText('Research')).not.toBeInTheDocument();
    expect(screen.getByText('Answers')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Question Doc 1/ })).toHaveAttribute(
      'href',
      '/questions/question-doc-1?utm_source=user-profile#comment:5',
    );
  });

  it("renders nothing if answers aren't present", () => {
    const { container } = render(
      <MemoryRouter>
        <ProfileContributions docs={{ projects: [], research: [], answers: [] }} username="test-user" />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
