import ReactGA from 'react-ga4';

import { GoogleAnalytics } from './GoogleAnalytics';

import type { SubscribableContentTypes } from 'oa-shared';
import type { UaEventOptions } from 'react-ga4/types/ga4';

export type EventAction =
  | 'donationModalOpened'
  | 'unsubscribed'
  | 'subscribed'
  | 'deleted'
  | 'useful'
  | 'usefulRemoved';

export type EventCategory = 'profiles' | SubscribableContentTypes;

export type TrackEventOptions = Omit<UaEventOptions, 'action' | 'category'> & {
  action: EventAction;
  category: EventCategory;
};

export const trackEvent = (options: TrackEventOptions) => {
  ReactGA.event(options);
};

export const Analytics = GoogleAnalytics;
