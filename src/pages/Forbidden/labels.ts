export const ForbiddenPage = {
  ADMIN: 'admin',
  RESEARCH_CREATE: 'research-create',
  NEWS_CREATE: 'news-create',
  RESEARCH_EDIT: 'research-edit',
  RESEARCH_EDIT_CREATE: 'research-edit-create',
  RESEARCH_UPDATE_EDIT: 'research-update-edit',
  NEWS_EDIT: 'news-edit',
  QUESTION_EDIT: 'question-edit',
  LIBRARY_EDIT: 'library-edit',
} as const;

export type ForbiddenPage = (typeof ForbiddenPage)[keyof typeof ForbiddenPage];

type ForbiddenMessage = { heading?: string; body: string; actionLabel?: string };

const DEFAULT_HEADING = 'Restricted area';
const DEFAULT_ACTION_LABEL = 'Report the problem';
const DEFAULT_BODY =
  "You don't have the right permissions to go here right now. If this is wrong, please let us know.";

// Only pages needing copy that differs from the default go here - most gates need nothing added.
const OVERRIDES: Partial<Record<ForbiddenPage, ForbiddenMessage>> = {
  [ForbiddenPage.RESEARCH_CREATE]: {
    heading: "Oh no you can't post, yet",
    body: "This is a new feature and we are currently rolling it out to a small group of people. Let us know if you have a project to share and want to be an early tester. We'd love to set you up.",
    actionLabel: 'I want to use it',
  },
  [ForbiddenPage.NEWS_CREATE]: { body: "You don't have permission to create news posts." },
  [ForbiddenPage.RESEARCH_EDIT]: { body: "You don't have permission to edit this research." },
  [ForbiddenPage.RESEARCH_EDIT_CREATE]: {
    body: "You don't have permission to add an update to this research.",
  },
  [ForbiddenPage.RESEARCH_UPDATE_EDIT]: {
    body: "You don't have permission to edit this research update.",
  },
  [ForbiddenPage.NEWS_EDIT]: { body: "You don't have permission to edit this news post." },
  [ForbiddenPage.QUESTION_EDIT]: { body: "You don't have permission to edit this question." },
  [ForbiddenPage.LIBRARY_EDIT]: { body: "You don't have permission to edit this project." },
  // ADMIN intentionally has no override - the default message already fits.
};

export function getForbiddenMessage(page: string | null) {
  const override = page ? OVERRIDES[page as ForbiddenPage] : undefined;

  return {
    heading: override?.heading ?? DEFAULT_HEADING,
    body: override?.body ?? DEFAULT_BODY,
    actionLabel: override?.actionLabel ?? DEFAULT_ACTION_LABEL,
  };
}
