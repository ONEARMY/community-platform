import type { availableGlyphs } from 'oa-components';
import type { ComponentType } from 'react';
import type { SettingsRoute } from './settingsTabs';

export interface ISettingsTab {
  header?: React.ReactNode;
  body: ComponentType;
  glyph: availableGlyphs;
  title: string;
  route: SettingsRoute;
}
