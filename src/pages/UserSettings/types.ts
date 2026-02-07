import type { availableGlyphs } from 'oa-components';
import type { ComponentType } from 'react';

export interface ISettingsTab {
  header?: React.ReactNode;
  body: ComponentType;
  glyph: availableGlyphs;
  title: string;
  route: string;
}
