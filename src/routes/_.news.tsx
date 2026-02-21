import { useContext } from 'react';
import { Outlet } from 'react-router';
import { isModuleSupported, MODULE } from 'src/modules';
import Main from 'src/pages/common/Layout/Main';
import { TenantContext } from 'src/pages/common/TenantContext';
import { generateTags, mergeMeta } from 'src/utils/seo.utils';

export async function loader() {
  return null;
}

export function HydrateFallback() {
  return <div></div>;
}

export const meta = mergeMeta<typeof loader>(() => {
  const title = `News - ${import.meta.env.VITE_SITE_NAME}`;

  return generateTags(title);
});

export default function Index() {
  const tenantContext = useContext(TenantContext);

  if (!isModuleSupported(tenantContext?.supportedModules || '', MODULE.NEWS)) {
    return null;
  }

  return (
    <Main style={{ flex: 1 }}>
      <Outlet />
    </Main>
  );
}
