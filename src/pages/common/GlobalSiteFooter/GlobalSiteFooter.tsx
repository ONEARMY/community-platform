import { SiteFooter } from 'oa-components';
import { useContext, useMemo } from 'react';
import { useLocation } from 'react-router';

import { TenantContext } from '../TenantContext';

const GlobalSiteFooter = () => {
  const tenantContext = useContext(TenantContext);
  const location = useLocation();

  const showFooter = useMemo(() => {
    const path = location?.pathname;

    return !path.startsWith('/map') && !path.startsWith('/academy') && path !== '/';
  }, [location?.pathname]);

  return showFooter ? <SiteFooter siteName={tenantContext?.environment?.VITE_SITE_NAME || 'Community Platform'} /> : null;
};

export default GlobalSiteFooter;
