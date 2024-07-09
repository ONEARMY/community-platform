// Used the guide at https://mui.com/base-ui/react-tabs/ as a fundation

import { useState } from 'react'
import { Tabs } from '@mui/base/Tabs'
import { Flex } from 'theme-ui'

import { SettingsFormTab } from './SettingsFormTab'
import { SettingsFormTabList } from './SettingsFormTabList'

import type { ThemeUIStyleObject } from 'theme-ui'
import type { ITab } from './SettingsFormTab'

export interface IProps {
  tabs: ITab[]
  sx?: ThemeUIStyleObject | undefined
}

export const SettingsFormWrapper = (props: IProps) => {
  const { sx, tabs } = props
  const [value, setValue] = useState<number>(0)

  const handleChange = (
    _: React.SyntheticEvent<Element, Event> | null,
    value: string | number | null,
  ) => {
    typeof value === 'number' && setValue(value)
  }

  return (
    <Flex sx={sx}>
      <Tabs value={value} onChange={handleChange}>
        <Flex
          sx={{
            gap: 3,
            flexDirection: ['column', 'row'],
          }}
        >
          <SettingsFormTabList tabs={tabs} value={value} setValue={setValue} />

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
        </Flex>
      </Tabs>
    </Flex>
  )
}
