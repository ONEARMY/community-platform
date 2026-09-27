export interface ISentryConfig {
  dsn: string;
  environment: string;
  sampleRate: number;
}

export type siteVariants = 'dev_site' | 'test-ci' | 'staging' | 'production' | 'preview';
