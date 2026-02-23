import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import ExternalEmbed from 'src/pages/Academy/ExternalEmbed/ExternalEmbed';
import { TenantContext } from '../common/TenantContext';

export const getFrameSrc = (base: string, path: string): string =>
  `${base}${path
    .split('/')
    .filter((str) => str !== 'academy' && Boolean(str))
    .join('/')}`;

const Academy = () => {
  const location = useLocation();
  const tenantContext = useContext(TenantContext);

  const [initial, setInitial] = useState<string>(tenantContext?.academyResource || '');

  useEffect(() => {
    // set initial only once
    const newInitial = getFrameSrc(tenantContext?.academyResource || '', location.pathname);

    if (newInitial !== initial) {
      setInitial(newInitial);
    }
  }, []);

  return <ExternalEmbed src={initial} />;
};

export default Academy;
