import { Card } from '@theme-ui/components';
import { TabsContent } from '@/components/ui/tabs';

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
    <TabsContent value={value} className="flex flex-col">
      {tab.header && (
        <Card sx={{ ...sx, backgroundColor: 'softblue', padding: [3, 5] }}>{tab.header}</Card>
      )}
      {tab.preBody && <tab.preBody />}
      <Card sx={sx}>
        <tab.body />
      </Card>
    </TabsContent>
  );
};
