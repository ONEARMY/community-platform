import styled from '@emotion/styled'
import { Tab as MuiTab } from '@mui/base/Tab'
import { TabsList as MuiTabsList } from '@mui/base/TabsList'
import { TabPanel } from '@mui/base/TabPanel'
import { Tabs } from '@mui/base/Tabs'
import type { PlatformTheme } from 'oa-themes/dist'

export { TabPanel, Tabs }

export const Tab = styled(MuiTab)`
  background-color: transparent;
  border: none;
  box-shadow: 0 2px 0px 0px transparent;
  cursor: pointer;
  font-family: ${(p) =>
    (p.theme as PlatformTheme['styles'])?.text?.heading.fontFamily};
  font-size: ${(p) => (p.theme as PlatformTheme['styles'])?.fontSizes?.[2]}px;
  padding: ${(p) => (p.theme as PlatformTheme['styles'])?.space?.[2]}px 0;
  margin-right: ${(p) => (p.theme as PlatformTheme['styles'])?.space?.[3]}px;

  &:first-of-type {
    padding-left: 0;
  }

  &.Mui-selected {
    box-shadow: 0 2px 0px 0px
      ${(p) => (p.theme as PlatformTheme['styles'])?.colors?.accent.base};
  }
`

export const TabsList = styled(MuiTabsList)`
  border-bottom: 2px solid #f4f7fa;
`
