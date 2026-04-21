export interface WebAppManifest {
  background_color?: string;
  categories?: string[];
  description?: string;
  dir?: 'auto' | 'ltr' | 'rtl';
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  display_override?: (
    | 'fullscreen'
    | 'standalone'
    | 'minimal-ui'
    | 'browser'
    | 'window-controls-overlay'
  )[];
  iarc_rating_id?: string;
  icons?: ManifestIcon[];
  id?: string;
  lang?: string;
  name?: string;
  orientation?:
    | 'any'
    | 'natural'
    | 'landscape'
    | 'landscape-primary'
    | 'landscape-secondary'
    | 'portrait'
    | 'portrait-primary'
    | 'portrait-secondary';
  scope?: string;
  short_name?: string;
  start_url?: string;
  theme_color?: string;
}

interface ManifestIcon {
  src: string;
  sizes?: string;
  type?: string;
  purpose?: 'any' | 'maskable' | 'monochrome' | 'badge';
}
