import '@testing-library/jest-dom/vitest';

import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProfileContributions } from './ProfileContributions';

import type { Question } from 'oa-shared';

const mockQuestions: Partial<Question>[] = [
  {
    id: 1,
    slug: 'question-doc-1',
    title: 'Question Doc 1',
    usefulCount: 2,
  },
];

describe('ProfileContributions', () => {
  it('renders only questions section', () => {
    render(
      <MemoryRouter>
        <ProfileContributions docs={{ projects: [], research: [], questions: mockQuestions }} username="test-user" />
      </MemoryRouter>,
    );
    expect(screen.queryByText('Library')).not.toBeInTheDocument();
    expect(screen.queryByText('Research')).not.toBeInTheDocument();
    expect(screen.getByText('Questions')).toBeInTheDocument();
    expect(screen.getByText('Question Doc 1')).toBeInTheDocument();
  });

  it("renders nothing if questions aren't present", () => {
    const { container } = render(
      <MemoryRouter>
        <ProfileContributions docs={{ projects: [], research: [], questions: [] }} username="test-user" />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
