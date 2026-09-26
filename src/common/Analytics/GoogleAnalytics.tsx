import { useContext, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { TenantContext } from 'src/pages/common/TenantContext';

export const GoogleAnalytics = () => {
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

  return null;
};
