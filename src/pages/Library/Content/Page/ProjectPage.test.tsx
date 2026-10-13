import '@testing-library/jest-dom/vitest';
import { act, render } from '@testing-library/react';
import { Provider } from 'mobx-react';
import type { Project } from 'oa-shared';
import { theme } from 'oa-themes';
import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { FactoryLibraryItem } from 'src/test/factories/Library';
import { FactoryRemakeAuthor } from 'src/test/factories/Remake';
import { FactoryUser } from 'src/test/factories/User';
import { ThemeProvider } from '@theme-ui/core';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { ProjectPage } from './ProjectPage';

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({ profile: FactoryUser(), isUserAuthorized: vi.fn(() => false) }),
  ProfileStoreProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('src/stores/UsefulVote/useUsefulVote', () => ({
  useUsefulVote: () => ({ hasVoted: false, usefulCount: 0, toggle: vi.fn() }),
}));

const comments = vi.hoisted(() => ({ onLoaded: undefined as (() => void) | undefined }));

vi.mock('src/pages/common/CommentsSupabase/CommentSectionSupabase', () => ({
  CommentSectionSupabase: ({ onLoaded }: { onLoaded?: () => void }) => {
    comments.onLoaded = onLoaded;

    return <div data-cy="comments-stub" />;
  },
}));

vi.mock('./Remakes/RemakesSection', () => ({
  RemakesSection: () => <div data-cy="remakes-stub" />,
}));

const project = FactoryLibraryItem() as Project;
project.author = FactoryRemakeAuthor();

const getWrapper = (initialEntry: string) => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <Route path="/library/:slug" element={<ProjectPage item={project} />} />,
    ),
    { initialEntries: [initialEntry] },
  );

  return render(
    <Provider profileStore={{ user: FactoryUser() }}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  );
};

describe('ProjectPage', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    comments.onLoaded = undefined;
  });

  it('scrolls to the remakes card once, only after the comments have loaded, when the url targets it', () => {
    act(() => {
      getWrapper(`/library/${project.slug}#remakes`);
    });

    expect(comments.onLoaded).toBeDefined();
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    act(() => {
      comments.onLoaded?.();
    });

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(vi.mocked(Element.prototype.scrollIntoView).mock.contexts[0]).toHaveAttribute(
      'id',
      'remakes',
    );

    act(() => {
      comments.onLoaded?.();
    });

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('does not scroll when the url does not target the remakes card', () => {
    act(() => {
      getWrapper(`/library/${project.slug}`);
    });

    expect(comments.onLoaded).toBeDefined();

    act(() => {
      comments.onLoaded?.();
    });

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
