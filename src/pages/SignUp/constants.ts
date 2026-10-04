export const ORGANISATION_SIGNUP_STEPS = ['Sign-up', 'Verify email', 'Application form'];

export const ORGANISATION_DESCRIPTION_MAX_LENGTH = 500;

export const MAX_ORGANISATION_COVER_IMAGES = 4;

export const organisationActivityClause = (activity?: string) =>
  activity ? `that you work with ${activity}` : 'your organisation';
