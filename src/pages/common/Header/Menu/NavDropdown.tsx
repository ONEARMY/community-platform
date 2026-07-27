import styled from '@emotion/styled';
import { Icon } from 'oa-components';
import { theme } from 'oa-themes';
import { useState } from 'react';
import { NavLink } from 'react-router';
import { useClickOutside } from 'src/common/hooks/useClickOutside';
import type { INavGroup } from 'src/pages/PageList';
import { Box, Text } from 'theme-ui';
import { NavItem, type NavVariant } from './NavItem';

const DropdownRow = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.black};
  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

interface IProps {
  group: INavGroup;
  variant?: NavVariant;
  active?: boolean;
  dimmed?: boolean;
}

export const NavDropdown = ({ group, variant = 'desktop', active, dimmed }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside(() => setIsOpen(false));
  const isTab = variant === 'tab';

  const popoverPosition = {
    left: '50%',
    transform: 'translateX(-50%)',
    ...(isTab ? { bottom: 'calc(100% + 10px)' } : { top: 'calc(100% + 10px)' }),
  };
  const notchPosition = {
    left: '50%',
    transform: 'translateX(-50%) rotate(45deg)',
    ...(isTab ? { bottom: '-4px' } : { top: '-4px' }),
  };

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', display: 'inline-flex' }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      }}
    >
      <NavItem
        variant={variant}
        title={group.title}
        icon={group.icon}
        active={active}
        dimmed={dimmed}
        showChevron={!isTab}
        expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      />
      {isOpen && (
        <Box
          sx={{
            position: 'absolute',
            ...popoverPosition,
            zIndex: theme.zIndex.navDropdown,
            minWidth: '264px',
            bg: 'white',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'popoverBorder',
            filter: `drop-shadow(${theme.shadows.popover})`,
            p: '16px',
            '&::before': {
              content: '""',
              position: 'absolute',
              ...notchPosition,
              width: '21px',
              height: '21px',
              borderRadius: '3px',
              bg: 'white',
            },
          }}
        >
          {group.children.map((child) => (
            <DropdownRow
              key={child.path}
              to={child.path}
              data-cy="page-link"
              onClick={() => setIsOpen(false)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon glyph={child.icon} size={22} />
                <Text
                  sx={{
                    fontFamily: 'nav',
                    fontSize: '14px',
                    letterSpacing: '0.02em',
                    lineHeight: 1.2,
                    color: 'black',
                  }}
                >
                  {child.title}
                </Text>
              </Box>
              {child.description && (
                <Text
                  sx={{
                    fontFamily: 'nav',
                    fontSize: '12px',
                    letterSpacing: '0.01em',
                    color: 'darkGrey',
                    lineHeight: 1.2,
                    textIndent: '26px',
                  }}
                >
                  {child.description}
                </Text>
              )}
            </DropdownRow>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default NavDropdown;
