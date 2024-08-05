// Used the guide at https://mui.com/base-ui/react-tabs/ as a fundation

import { matchPath, useLocation } from 'react-router-dom'
import { Tabs } from '@mui/base/Tabs'
import { Flex } from 'theme-ui'

import { SettingsFormTab } from './SettingsFormTab'
import { SettingsFormTabList } from './SettingsFormTabList'
import { routeName } from './utils'

import type { ITab } from './SettingsFormTab'

export interface IProps {
  tabs: ITab[]
  style?: React.CSSProperties | undefined
}

const useRouteMatch = (patterns: readonly string[]) => {
  const { pathname } = useLocation()

  for (const pattern of patterns) {
    const possibleMatch = matchPath(pattern, pathname)
    if (possibleMatch !== null) {
      return possibleMatch
    }
  }

  return null
}

export const SettingsFormWrapper = (props: IProps) => {
  const { style, tabs } = props

  const routePaths = tabs.map(({ title }) => routeName(title))
  const routeMatch = useRouteMatch(routePaths)
  const currentTab = routeMatch?.pattern?.path || routePaths[0]

  return (
    <Tabs value={currentTab} style={style}>
      <Flex
        sx={{
          alignContent: 'stretch',
          alignSelf: 'stretch',
          justifyContent: 'stretch',
          flexDirection: ['column', 'row'],
          gap: 4,
        }}
      >
        <SettingsFormTabList tabs={tabs} currentTab={currentTab} />
        <Flex
          sx={{
            alignContent: 'stretch',
            justifyContent: 'stretch',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          {tabs.map((tab, index) => {
            return (
              <SettingsFormTab
                key={index}
                value={routeName(tab.title)}
                tab={tab}
              />
            )
          })}
        </Flex>
      </Flex>
    </Tabs>
  )
}
