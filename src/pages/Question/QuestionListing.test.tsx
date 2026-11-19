import '@testing-library/jest-dom/vitest';
import type { JwtPayload } from '@supabase/supabase-js';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { SessionContext } from 'src/pages/common/SessionContext';
import { FactoryQuestionItem } from 'src/test/factories/Question';
import { FactoryUser } from 'src/test/factories/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listing } from './labels';
import { QuestionListing } from './QuestionListing';
import { questionService } from './question.service';

const mockProfileState = vi.hoisted(() => ({
  profile: undefined as ReturnType<typeof FactoryUser> | undefined,
  isComplete: true,
}));

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => mockProfileState,
}));

vi.mock('src/services/categoryService', () => ({
  categoryService: {
    getCategories: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('./question.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./question.service')>();
  return {
    ...actual,
    questionService: {
      search: vi.fn(),
      getDraftCount: vi.fn(),
      getDrafts: vi.fn(),
    },
  };
});

function renderQuestionListing(initialEntry: string, session: JwtPayload | null = null) {
  const router = createMemoryRouter(
    [
      {
        path: '/questions',
        element: <QuestionListing />,
      },
    ],
    { initialEntries: [initialEntry] },
  );

  return render(
    <SessionContext.Provider value={session}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </SessionContext.Provider>,
  );
}

describe('QuestionListing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProfileState.profile = undefined;
    mockProfileState.isComplete = true;
    vi.mocked(questionService.search).mockResolvedValue({ items: [], total: 0 });
    vi.mocked(questionService.getDraftCount).mockResolvedValue(0);
    vi.mocked(questionService.getDrafts).mockResolvedValue([]);
  });

  it('shows default empty message when no questions exist and no search or filter is active', async () => {
    renderQuestionListing('/questions?sort=Newest');

    expect(await screen.findByText(listing.noQuestions)).toBeInTheDocument();
  });

  it('shows search empty message when a search query returns no results', async () => {
    renderQuestionListing('/questions?sort=MostRelevant&q=nonexistent');

    expect(await screen.findByText('No questions match your search')).toBeInTheDocument();
    expect(screen.queryByText(listing.noQuestions)).not.toBeInTheDocument();
  });

  it('shows search empty message when a category filter returns no results', async () => {
    renderQuestionListing('/questions?sort=Newest&category=1');

    expect(await screen.findByText('No questions match your search')).toBeInTheDocument();
    expect(screen.queryByText(listing.noQuestions)).not.toBeInTheDocument();
  });

  it('hides empty message when viewing drafts while published results are empty', async () => {
    const user = userEvent.setup();
    mockProfileState.profile = FactoryUser();
    const draft = FactoryQuestionItem({ title: 'My draft question', isDraft: true });
    vi.mocked(questionService.getDraftCount).mockResolvedValue(1);
    vi.mocked(questionService.getDrafts).mockResolvedValue([draft]);

    renderQuestionListing('/questions?sort=MostRelevant&q=nonexistent', {
      sub: 'user-123',
    } as JwtPayload);

    const draftsButton = await screen.findByRole('button', { name: /my drafts/i });
    await user.click(draftsButton);

    expect(await screen.findByText('My draft question')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('No questions match your search')).not.toBeInTheDocument();
      expect(screen.queryByText(listing.noQuestions)).not.toBeInTheDocument();
    });
  });
});
