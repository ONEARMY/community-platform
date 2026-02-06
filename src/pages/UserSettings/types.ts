import type { availableGlyphs } from 'oa-components';

export interface ISettingsTab {
  header?: React.ReactNode;
  body: React.ReactNode;
  glyph: availableGlyphs;
  title: string;
  route: string;
}
