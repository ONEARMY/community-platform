export interface ISentryConfig {
  dsn: string
  environment: string
}

export type siteVariants =
  | 'dev_site'
  | 'test-ci'
  | 'staging'
  | 'production'
  | 'preview'
