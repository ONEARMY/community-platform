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
  value: number
}

export const SettingsFormTab = (props: IProps) => {
  const { tab, value } = props
  const { body, header, notifications } = tab

  const sx = {
    marginBottom: 3,
    padding: 3,
    overflow: 'hidden',
  }

  return (
    <TabPanel value={value}>
      {header && (
        <Card sx={{ ...sx, backgroundColor: 'softblue' }}>{header}</Card>
      )}
      {notifications && <Box sx={{ ...sx, padding: 0 }}>{notifications}</Box>}
      <Card sx={sx}>{body}</Card>
    </TabPanel>
  )
}
