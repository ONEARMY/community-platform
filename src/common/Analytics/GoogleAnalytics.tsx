import { useContext, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router';
import { TenantContext } from 'src/pages/common/TenantContext';

export const GoogleAnalytics = () => {
  const location = useLocation();
  const env = useContext(TenantContext);
  const trackingIds = (env?.gaTrackingId ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  useEffect(() => {
    if (trackingIds.length) {
      ReactGA.initialize(trackingIds.map((trackingId) => ({ trackingId })));
    }
  }, []);

  useEffect(() => {
    if (trackingIds.length) {
      sendPageView(location);
    }
  }, [location]);

  const sendPageView = (location: any) => {
    ReactGA.set({ page: location.pathname });
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  };

  return null;
};
