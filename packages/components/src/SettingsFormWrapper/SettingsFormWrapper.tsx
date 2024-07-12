// Used the guide at https://mui.com/base-ui/react-tabs/ as a fundation

import { useEffect, useState } from 'react'
import { Tabs } from '@mui/base/Tabs'
import { Flex } from 'theme-ui'

import { SettingsFormTab } from './SettingsFormTab'
import { SettingsFormTabList } from './SettingsFormTabList'

import type { ITab } from './SettingsFormTab'

export interface IProps {
  setDefaultTab?: number
  tabs: ITab[]
  style?: React.CSSProperties | undefined
}

export const SettingsFormWrapper = (props: IProps) => {
  const { style, setDefaultTab, tabs } = props
  const [value, setValue] = useState<number>(setDefaultTab || 0)

  const setHash = (hash: number) => {
    history.pushState(null, '', `#${hash}`)
  }

  useEffect(() => {
    setHash(value)
  }, [])

  const handleChange = (
    _: React.SyntheticEvent<Element, Event> | null,
    value: string | number | null,
  ) => {
    if (typeof value === 'number') {
      setValue(value)
      setHash(value)
    }
  }

  return (
    <Tabs value={value} onChange={handleChange} style={style}>
      <Flex
        sx={{
          alignContent: 'stretch',
          alignSelf: 'stretch',
          justifyContent: 'stretch',
          flexDirection: ['column', 'row'],
          gap: 2,
        }}
      >
        <SettingsFormTabList tabs={tabs} value={value} setValue={setValue} />
        <Flex
          sx={{
            alignContent: 'stretch',
            justifyContent: 'stretch',
            flexDirection: 'column',
            flex: 7,
          }}
        >
          {tabs.map((tab, index) => {
            return <SettingsFormTab key={index} value={index} tab={tab} />
          })}
        </Flex>
      </Flex>
    </Tabs>
  )
}
