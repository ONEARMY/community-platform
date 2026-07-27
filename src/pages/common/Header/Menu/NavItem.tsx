import type { Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { Icon } from 'oa-components';
import { NavLink, useLocation } from 'react-router';
import type { NavGlyph } from 'src/pages/PageList';

export type NavVariant = 'desktop' | 'tab';

const itemStyles = ({ theme }: { theme: Theme }) => `
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  letter-spacing: 0.02em;
  line-height: 1.2;
  color: ${theme.colors.black};
  background: transparent;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s ease;
  &:hover {
    background: ${theme.colors.background};
  }
  &.tab {
    flex-direction: column;
    gap: 0;
    padding: 8px;
    font-size: 13px;
    letter-spacing: 0.02em;
    text-align: center;
  }
  &.dimmed {
    opacity: 0.54;
  }
  &.active {
    background: ${theme.colors.background};
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    opacity: 1;
  }
`;

const NavLinkItem = styled(NavLink)`
  font-family: ${({ theme }) => theme.fonts.nav};
  ${itemStyles}
`;

const NavButtonItem = styled.button`
  font-family: ${({ theme }) => theme.fonts.nav};
  ${itemStyles}
`;

interface IProps {
  title: string;
  icon: NavGlyph;
  variant?: NavVariant;
  to?: string;
  onClick?: () => void;
  active?: boolean;
  dimmed?: boolean;
  showChevron?: boolean;
  expanded?: boolean;
}

export const NavItem = ({
  title,
  icon,
  variant = 'desktop',
  to,
  onClick,
  active,
  dimmed,
  showChevron,
  expanded,
}: IProps) => {
  const location = useLocation();
  const isTab = variant === 'tab';

  const className = (withActive?: boolean) =>
    [isTab && 'tab', dimmed && 'dimmed', withActive && 'active'].filter(Boolean).join(' ') ||
    undefined;

  const content = (
    <>
      <Icon glyph={icon} size={isTab ? 32 : 22} />
      <span>{title}</span>
      {showChevron && <Icon glyph="chevron-down" size={10} />}
    </>
  );

  if (to) {
    return (
      <NavLinkItem
        to={to}
        className={className()}
        data-cy="page-link"
        onClick={(e) => {
          if (location.pathname === to) {
            e.preventDefault();
          }
          onClick?.();
        }}
      >
        {content}
      </NavLinkItem>
    );
  }

  return (
    <NavButtonItem
      type="button"
      className={className(active)}
      data-cy="page-link"
      aria-expanded={expanded}
      onClick={onClick}
    >
      {content}
    </NavButtonItem>
  );
};

export default NavItem;
