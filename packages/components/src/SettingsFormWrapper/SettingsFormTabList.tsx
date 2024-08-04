import styled from '@emotion/styled'
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab'
import { TabsList as BaseTabsList } from '@mui/base/TabsList'
import { prepareForSlot } from '@mui/base/utils'
import { useNavigate } from '@remix-run/react'
import { Flex } from 'theme-ui'

import { Icon } from '../Icon/Icon'
import { InternalLink } from '../InternalLink/InternalLink'
import { Select } from '../Select/Select'
import { routeName } from './utils'

import type { ITab } from './SettingsFormTab'

interface IProps {
  currentTab: string
  tabs: ITab[]
}

export const SettingsFormTabList = (props: IProps) => {
  const { currentTab, tabs } = props
  const navigate = useNavigate()

  const Tab = styled(BaseTab)`
    color: grey;
    cursor: pointer;
    background-color: transparent;
    padding: 12px 18px;
    border: none;
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
      border: 2px solid #666;
    }

    &.${tabClasses.disabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.${tabClasses.selected} {
      color: #1b1b1b;
      border: 2px solid #1b1b1b;
      background-color: #e2edf7;
    }
  `

  const TabsList = styled(BaseTabsList)`
    width: 100%;
    display: flex;
    gap: 12px;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
  `

  if (tabs.length === 1) return

  const defaultValue = {
    label:
      tabs.find(({ title }) => routeName(title) === currentTab)?.title || '',
    value: currentTab,
  }

  return (
    <>
      <Flex sx={{ display: ['none', 'flex'], flex: 2 }}>
        <TabsList>
          {tabs.map(({ glyph, title }, index) => {
            return (
              <Tab
                key={index}
                to={routeName(title)}
                value={routeName(title)}
                data-cy={`tab-${title}`}
                slots={{ root: prepareForSlot(InternalLink) }}
              >
                <Icon glyph={glyph} size={20} /> {title}
              </Tab>
            )
          })}
        </TabsList>
      </Flex>

      <Flex sx={{ display: ['flex', 'none'] }}>
        <TabsList>
          <Select
            defaultValue={defaultValue}
            onChange={(event) => navigate(event.value)}
            variant="tabs"
            options={tabs.map(({ title }) => {
              return {
                label: title,
                value: routeName(title),
              }
            })}
          />
        </TabsList>
      </Flex>
    </>
  )
}
