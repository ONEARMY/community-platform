import ReactGA from 'react-ga4';

import { GoogleAnalytics } from './GoogleAnalytics';

import type { UaEventOptions } from 'react-ga4/types/ga4';

export const trackEvent = (options: UaEventOptions) => {
  ReactGA.event(options);
};

export const Analytics = GoogleAnalytics;
