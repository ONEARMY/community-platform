// Used the guide at https://mui.com/base-ui/react-tabs/ as a fundation

import styled from '@emotion/styled'
import { Tabs as BaseTabs } from '@mui/base/Tabs'
import { Flex } from 'theme-ui'

import { SettingsFormTab } from './SettingsFormTab'
import { SettingsFormTabList } from './SettingsFormTabList'

import type { ITab } from './SettingsFormTab'

export interface IProps {
  tabs: ITab[]
}

export const SettingsFormWrapper = (props: IProps) => {
  const { tabs } = props

  const Tabs = styled(BaseTabs)`
    display: flex;
    gap: 16px;
  `

  return (
    <Tabs defaultValue={0}>
      <SettingsFormTabList tabs={tabs} />

      <Flex
        sx={{
          alignContent: 'stretch',
          flexDirection: 'column',
          flex: 5,
        }}
      >
        {tabs.map((tab, index) => {
          return <SettingsFormTab key={index} value={index} tab={tab} />
        })}
      </Flex>
    </Tabs>
  )
}
