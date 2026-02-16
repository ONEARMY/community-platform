import styled from '@emotion/styled';
import { useContext } from 'react';
import { NavLink } from 'react-router';
import MenuCurrent from 'src/assets/images/menu-current.svg';
import { getSupportedModules } from 'src/modules';
import { getAvailablePageList } from 'src/pages/PageList';
import { Flex } from 'theme-ui';

import { TenantContext } from '../../TenantContext';

const MenuLink = styled(NavLink)`
  padding: 0px ${(props) => props.theme.space[4]}px;
  color: ${'black'};
  position: relative;
  > div {
    z-index: ${(props) => props.theme.zIndex.default};
    position: relative;
    &:hover {
      opacity: 0.7;
    }
  }
  &.active {
    &:after {
      content: '';
      width: 70px;
      height: 20px;
      display: block;
      position: absolute;
      bottom: -6px;
      background-color: ${(props) => props.theme.colors.accent.base};
      mask-size: contain;
      mask-image: url(\"${MenuCurrent}\");
      mask-repeat: no-repeat;
      z-index: ${(props) => props.theme.zIndex.level};
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
    }
  }
`;

export const MenuDesktop = () => {
  const tenantContext = useContext(TenantContext);

  return (
    <Flex sx={{ alignItems: 'center', width: '100%' }}>
      {getAvailablePageList(getSupportedModules(tenantContext?.environment?.VITE_SUPPORTED_MODULES || '')).map((page) => (
        <Flex key={page.path}>
          <MenuLink to={page.path} data-cy="page-link">
            <Flex>{page.title}</Flex>
          </MenuLink>
        </Flex>
      ))}
    </Flex>
  );
};

export default MenuDesktop;
