import { SiteFooter } from 'oa-components';
import { useContext, useMemo } from 'react';
import { useLocation } from 'react-router';

import { TenantContext } from '../TenantContext';

const HIDDEN_PATHS = ['/', '/map', '/academy', '/support'];

const GlobalSiteFooter = () => {
  const tenantContext = useContext(TenantContext);
  const location = useLocation();

  const showFooter = useMemo(() => {
    const path = location?.pathname;
    return !HIDDEN_PATHS.some((p) => (p === '/' ? path === p : path.startsWith(p)));
  }, [location?.pathname]);

  return showFooter ? (
    <SiteFooter siteName={tenantContext?.siteName || 'Community Platform'} />
  ) : null;
};

export default GlobalSiteFooter;
