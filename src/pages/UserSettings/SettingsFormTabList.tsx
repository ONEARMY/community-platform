import styled from '@emotion/styled';
import { Icon, InternalLink, Select } from 'oa-components';
import { useMemo } from 'react';
import { Flex } from 'theme-ui';

import type { ISettingsTab } from './types';

const NavButton = styled(InternalLink)<{ $isActive: boolean }>`
  color: ${(props) => (props.$isActive ? '#1b1b1b' : 'grey')};
  cursor: pointer;
  background-color: ${(props) => (props.$isActive ? '#e2edf7' : 'transparent')};
  padding: 12px 18px;
  outline: ${(props) => (props.$isActive ? '2px solid #1b1b1b' : 'none')};
  border-radius: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  font-size: 18px;
  font-family: Varela round;
  align-items: center;
  text-decoration: none;

  &:hover {
    background-color: white;
  }

  &:focus-visible {
    outline: 2px solid #666;
    outline-offset: 2px;
  }
`;

const NavList = styled.nav`
  width: 100%;
  display: flex;
  gap: 12px;
  flex-direction: column;
  justify-content: flex-start;
  align-content: flex-start;
`;

interface IProps {
  currentTab: string;
  tabs: ISettingsTab[];
  onTabChange: (path: string) => void;
}

export const SettingsFormTabList = (props: IProps) => {
  const { currentTab, tabs, onTabChange } = props;

  const currentValue = useMemo(
    () => ({
      label: tabs.find(({ route }) => route === currentTab)?.title || '',
      value: currentTab,
    }),
    [currentTab, tabs],
  );

  const selectOptions = useMemo(
    () =>
      tabs.map(({ title, route }) => ({
        label: title,
        value: route,
      })),
    [tabs],
  );

  if (tabs.length === 1) {
    return null;
  }

  return (
    <>
      <Flex sx={{ display: ['none', 'flex'] }}>
        <NavList aria-label="Settings navigation">
          {tabs.map(({ glyph, title, route }) => {
            const isActive = route === currentTab;
            return (
              <NavButton
                key={title}
                to={route}
                $isActive={isActive}
                data-cy={`tab-${title}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon glyph={glyph} size={20} /> {title}
              </NavButton>
            );
          })}
        </NavList>
      </Flex>

      <Flex sx={{ display: ['flex', 'none'] }}>
        <Select
          value={currentValue}
          onChange={(event) => onTabChange(event.value)}
          variant="tabs"
          options={selectOptions}
          aria-label="Settings navigation"
        />
      </Flex>
    </>
  );
};
