import '@testing-library/jest-dom/vitest';

import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import UserCreatedDocuments from './UserCreatedDocuments';

import type { Question } from 'oa-shared';

const mockQuestions: Partial<Question>[] = [
  {
    id: 1,
    slug: 'question-doc-1',
    title: 'Question Doc 1',
    usefulCount: 2,
  },
];

describe('UserCreatedDocuments', () => {
  it('renders only questions section', () => {
    render(
      <MemoryRouter>
        <UserCreatedDocuments docs={{ projects: [], research: [], questions: mockQuestions }} columns={2} />
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
        <UserCreatedDocuments docs={{ projects: [], research: [], questions: [] }} columns={2} />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
