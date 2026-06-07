import { theme } from 'oa-themes';
import { useContext } from 'react';
import { useLocation } from 'react-router';
import { getSupportedModules } from 'src/modules';
import { getNavigation, type INavEntry } from 'src/pages/PageList';
import { Flex } from 'theme-ui';
import { TenantContext } from '../../TenantContext';
import { MOBILE_NAV_HEIGHT } from '../navLayout';
import { NavDropdown } from './NavDropdown';
import { NavItem } from './NavItem';

export const MobileBottomNav = () => {
  const tenantContext = useContext(TenantContext);
  const { pathname } = useLocation();
  const navigation = getNavigation(
    getSupportedModules(tenantContext?.supportedModules || ''),
    tenantContext?.hiddenModules,
  );

  const matchesPath = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  const isEntryActive = (entry: INavEntry) =>
    entry.kind === 'leaf'
      ? matchesPath(entry.leaf.path)
      : entry.group.children.some((child) => matchesPath(child.path));
  const anyActive = navigation.some(isEntryActive);

  return (
    <Flex
      as="nav"
      aria-label="Main"
      data-cy="mobile-bottom-nav"
      sx={{
        display: ['flex', 'flex', 'none'],
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: MOBILE_NAV_HEIGHT,
        zIndex: theme.zIndex.header,
        backgroundColor: 'white',
        borderTop: '1px solid #ddd',
        boxShadow: 'bottomNav',
        justifyContent: 'space-around',
        alignItems: 'center',
        px: ['8px', '16px'],
        py: '8px',
      }}
    >
      {navigation.map((entry) => {
        const dimmed = anyActive && !isEntryActive(entry);
        return entry.kind === 'leaf' ? (
          <NavItem
            key={entry.leaf.path}
            variant="tab"
            to={entry.leaf.path}
            icon={entry.leaf.icon}
            title={entry.leaf.title}
            dimmed={dimmed}
          />
        ) : (
          <NavDropdown
            key={entry.group.id}
            variant="tab"
            group={entry.group}
            active={isEntryActive(entry)}
            dimmed={dimmed}
          />
        );
      })}
    </Flex>
  );
};

export default MobileBottomNav;
