import styled from '@emotion/styled';
import { Icon } from 'oa-components';
import { NavLink, useLocation } from 'react-router';
import type { NavGlyph } from 'src/pages/PageList';

export type NavVariant = 'desktop' | 'tab';

const itemStyles = `
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  letter-spacing: 0.28px;
  line-height: 1.2;
  color: #000;
  background: transparent;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s ease;
  &:hover {
    background: #f4f6f7;
  }
  &.tab {
    flex-direction: column;
    gap: 0;
    padding: 8px;
    font-size: 13px;
    letter-spacing: 0.26px;
    text-align: center;
  }
  &.dimmed {
    opacity: 0.54;
  }
  &.active {
    background: #f4f6f7;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    opacity: 1;
  }
`;

const NavLinkItem = styled(NavLink)`
  font-family: ${(props) => (props.theme as any).fonts.nav};
  ${itemStyles}
`;

const NavButtonItem = styled.button`
  font-family: ${(props) => (props.theme as any).fonts.nav};
  ${itemStyles}
`;

const TabIconBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
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
      {isTab ? (
        <TabIconBox>
          <Icon glyph={icon} size={32} />
        </TabIconBox>
      ) : (
        <Icon glyph={icon} size={22} />
      )}
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
