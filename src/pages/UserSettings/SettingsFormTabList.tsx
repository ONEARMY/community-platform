import styled from '@emotion/styled';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { prepareForSlot } from '@mui/base/utils';
import { Icon, InternalLink, Select } from 'oa-components';
import { useMemo } from 'react';
import { Flex } from 'theme-ui';

import type { ISettingsTab } from './types';

const Tab = styled(BaseTab)`
  color: grey;
  cursor: pointer;
  background-color: transparent;
  padding: 12px 18px;
  outline: none;
  border-radius: 12px;
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  font-size: 18px;
  font-family: Varela round;
  align-items: center;

  &:hover {
    background-color: white;
  }

  &:focus {
    outline: 2px solid #666;
  }

  &.${tabClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.${tabClasses.selected} {
    color: #1b1b1b;
    outline: 2px solid #1b1b1b;
    background-color: #e2edf7;
  }
`;

const TabsList = styled(BaseTabsList)`
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

  if (tabs.length === 1) return null;

  return (
    <>
      <Flex sx={{ display: ['none', 'flex'] }}>
        <TabsList>
          {tabs.map(({ glyph, title, route }) => {
            return (
              <Tab
                key={title}
                to={route}
                value={route}
                data-cy={`tab-${title}`}
                slots={{ root: prepareForSlot(InternalLink) }}
              >
                <Icon glyph={glyph} size={20} /> {title}
              </Tab>
            );
          })}
        </TabsList>
      </Flex>

      <Flex sx={{ display: ['flex', 'none'] }}>
        <TabsList>
          <Select
            value={currentValue}
            onChange={(event) => onTabChange(event.value)}
            variant="tabs"
            options={selectOptions}
          />
        </TabsList>
      </Flex>
    </>
  );
};
