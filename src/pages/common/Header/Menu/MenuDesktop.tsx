import { useContext } from 'react';
import { useLocation } from 'react-router';
import { getSupportedModules } from 'src/modules';
import { getNavigation } from 'src/pages/PageList';
import { Flex } from 'theme-ui';

import { TenantContext } from '../../TenantContext';
import { NavDropdown } from './NavDropdown';
import { NavItem } from './NavItem';

export const MenuDesktop = () => {
  const tenantContext = useContext(TenantContext);
  const { pathname } = useLocation();
  const navigation = getNavigation(
    getSupportedModules(tenantContext?.supportedModules || ''),
    tenantContext?.hiddenModules,
  );

  const matchesPath = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <Flex
      as="nav"
      aria-label="Main"
      sx={{ alignItems: 'center', gap: '16px', display: ['none', 'none', 'flex'] }}
    >
      {navigation.map((entry) =>
        entry.kind === 'leaf' ? (
          <NavItem
            key={entry.leaf.path}
            to={entry.leaf.path}
            icon={entry.leaf.icon}
            title={entry.leaf.title}
          />
        ) : (
          <NavDropdown
            key={entry.group.id}
            group={entry.group}
            active={entry.group.children.some((child) => matchesPath(child.path))}
          />
        ),
      )}
    </Flex>
  );
};

export default MenuDesktop;
