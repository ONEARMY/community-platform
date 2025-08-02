export interface ISentryConfig {
  dsn: string
  environment: string
}

export type siteVariants =
  | 'emulated_site'
  | 'dev_site'
  | 'test-ci'
  | 'staging'
  | 'production'
  | 'preview'
