import { TabPanel } from '@mui/base/TabPanel';
import { Card } from '@theme-ui/components';

import type { ISettingsTab } from './types';

interface IProps {
  tab: ISettingsTab;
  value: string;
}

export const SettingsFormTab = (props: IProps) => {
  const { tab, value } = props;

  const sx = {
    borderRadius: 3,
    marginBottom: 4,
    padding: [2, 4],
    overflow: 'visible',
  };

  return (
    <TabPanel
      value={value}
      style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch' }}
    >
      {tab.header && (
        <Card sx={{ ...sx, backgroundColor: 'softblue', padding: [3, 5] }}>{tab.header}</Card>
      )}
      <Card sx={sx}>
        <tab.body />
      </Card>
    </TabPanel>
  );
};
