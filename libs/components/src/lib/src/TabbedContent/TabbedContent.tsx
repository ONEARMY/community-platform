import styled from '@emotion/styled'
import { Tab as MuiTab } from '@mui/base/Tab'
import { TabPanel as MuiTabPanel } from '@mui/base/TabPanel'
import { Tabs } from '@mui/base/Tabs'
import { TabsList } from '@mui/base/TabsList'

import type { PlatformTheme } from 'oa-themes/dist'

export { Tabs, TabsList }

type Theme = PlatformTheme['styles']

export const Tab = styled(MuiTab)`
  background-color: transparent;
  border: none;
  border-top-left-radius: ${(p) => (p.theme as Theme)?.space?.[2]}px;
  border-top-right-radius: ${(p) => (p.theme as Theme)?.space?.[2]}px;
  box-shadow: 0 2px 0px 0px transparent;
  cursor: pointer;
  font-family: ${(p) => (p.theme as Theme)?.text?.heading.fontFamily};
  font-size: ${(p) => (p.theme as Theme)?.fontSizes?.[2]}px;
  padding: ${(p) => (p.theme as Theme)?.space?.[2]}px
    ${(p) => (p.theme as Theme)?.space?.[3]}px;
  margin-right: ${(p) => (p.theme as Theme)?.space?.[3]}px;

  &:hover {
    text-decoration: underline;
  }

  &:first-of-type {
    margin-left: 0;
    position: relative;
  }

  &.base--selected {
    background-color: ${(p) => (p.theme as Theme)?.colors.background};
    text-decoration: none;

    &:after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 100%;
      height: ${(p) => (p.theme as Theme)?.space?.[3]}px;
      width: ${(p) => (p.theme as Theme)?.space?.[3]}px;
      background-color: ${(p) => (p.theme as Theme)?.colors.background};
    }
  }
`

export const TabPanel = styled(MuiTabPanel)`
  background-color: ${(p) => (p.theme as Theme)?.colors.background};
  border-radius: ${(p) => (p.theme as Theme)?.space?.[2]}px;
  padding: ${(p) => (p.theme as Theme)?.space?.[3]}px;
`
