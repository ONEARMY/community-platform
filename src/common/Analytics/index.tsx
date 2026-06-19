import type { SubscribableContentTypes } from 'oa-shared';
import ReactGA from 'react-ga4';
import { GoogleAnalytics } from './GoogleAnalytics';

export type EventAction =
  | 'donationModalOpened'
  | 'unsubscribed'
  | 'subscribed'
  | 'deleted'
  | 'useful'
  | 'usefulRemoved'
  | 'upgradeBadgeClicked';

export type EventCategory = 'profiles' | SubscribableContentTypes;

export type TrackEventOptions = Omit<Parameters<typeof ReactGA.event>[0], 'action' | 'category'> & {
  action: EventAction;
  category: EventCategory;
  label?: string;
};

export const trackEvent = (options: TrackEventOptions) => {
  ReactGA.event(options);
};

export const Analytics = GoogleAnalytics;
