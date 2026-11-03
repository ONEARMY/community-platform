import { Icon } from 'oa-components';
import { Link } from 'react-router';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { ISettingsTab } from './types';

interface IProps {
  tabs: ISettingsTab[];
}

export const SettingsFormTabList = ({ tabs }: IProps) => {
  if (tabs.length === 1) {
    return null;
  }

  return (
    <TabsList variant="outline">
      {tabs.map(({ glyph, title, route }) => (
        <TabsTrigger
          key={title}
          value={route}
          data-cy={`tab-${title}`}
          nativeButton={false}
          render={<Link to={route} />}
        >
          <Icon glyph={glyph} size={20} /> {title}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
