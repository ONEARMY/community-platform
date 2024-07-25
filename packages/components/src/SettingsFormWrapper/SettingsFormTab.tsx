import { TabPanel } from '@mui/base/TabPanel'
import { Card } from '@theme-ui/components'
import { Box } from 'theme-ui'

import type { availableGlyphs } from '../Icon/types'

export interface ITab {
  header?: React.ReactNode
  notifications?: React.ReactNode
  body: React.ReactNode
  glyph: availableGlyphs
  title: string
}

interface IProps {
  tab: ITab
  value: string
}

export const SettingsFormTab = (props: IProps) => {
  const { tab, value } = props
  const { body, header, notifications } = tab

  const sx = {
    borderRadius: 3,
    marginBottom: 3,
    padding: [2, 4],
    overflow: 'visible',
  }

  return (
    <TabPanel
      value={value}
      style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}
    >
      {header && (
        <Card sx={{ ...sx, backgroundColor: 'softblue' }}>{header}</Card>
      )}
      {notifications && <Box sx={{ ...sx, padding: 0 }}>{notifications}</Box>}
      <Card sx={sx}>{body}</Card>
    </TabPanel>
  )
}
