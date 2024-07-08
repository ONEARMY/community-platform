import styled from '@emotion/styled'
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab'
import { TabsList as BaseTabsList } from '@mui/base/TabsList'
import { Box, Select } from 'theme-ui'

import { Icon } from '../Icon/Icon'

import type { ITab } from './SettingsFormTab'

interface IProps {
  tabs: ITab[]
  value: number
  setValue: (value: number) => void
}

export const SettingsFormTabList = (props: IProps) => {
  const { tabs, value, setValue } = props

  if (tabs.length === 1) return

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
  `

  const TabsList = styled(BaseTabsList)`
    border-radius: inherit;
    display: flex;
    flex: 2;
    gap: 12px;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
  `

  const defaultValue = tabs.find((_, index) => index === value)?.title || ''

  return (
    <>
      <Box sx={{ display: ['none', 'inherit'] }}>
        <TabsList>
          {tabs.map(({ glyph, title }, index) => {
            return (
              <Tab key={index}>
                <Icon glyph={glyph} /> {title}
              </Tab>
            )
          })}
        </TabsList>
      </Box>

      <Box sx={{ display: ['inherit', 'none'] }}>
        <TabsList>
          <Select
            arrow={
              <Icon
                glyph="arrow-full-down"
                sx={{
                  ml: -7,
                  alignSelf: 'center',
                  pointerEvents: 'none',
                }}
              />
            }
            defaultValue={defaultValue}
          >
            {tabs.map(({ title }, index) => {
              return (
                <option key={index} onClick={() => setValue(index)}>
                  {title}
                </option>
              )
            })}
          </Select>
        </TabsList>
      </Box>
    </>
  )
}
