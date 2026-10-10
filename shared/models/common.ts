// A reminder that dates should be saved in the ISOString format
// i.e. new Date().toISOString() => 2011-10-05T14:48:00.000Z
// This is more consistent than others and allows better querying
export type ISODateString = string;

export type FetchState = 'idle' | 'fetching' | 'completed';

export interface ILatLng {
  lat: number;
  lng: number;
}

export type Collaborator = {
  countryCode?: string | null;
  userName: string | null;
  isVerified: boolean;
};

export type ContentType = 'questions' | 'projects' | 'research' | 'news';

export const UsefulContentTypes = [
  'questions',
  'projects',
  'research',
  'news',
  'comments',
] as const;
export type UsefulContentType = (typeof UsefulContentTypes)[number];

export function isUsefulContentType(value: string | undefined): value is UsefulContentType {
  return UsefulContentTypes.includes(value as UsefulContentType);
}

export type ContentFormType = 'questions' | 'projects' | 'research' | 'researchUpdate' | 'news';

export const DiscussionContentTypes = [
  'questions',
  'projects',
  'research_updates',
  'news',
] as const;
export type DiscussionContentType = (typeof DiscussionContentTypes)[number];

export type SubscribableContentTypes =
  | 'comments'
  | 'questions'
  | 'projects'
  | 'research'
  | 'research_updates'
  | 'news';
