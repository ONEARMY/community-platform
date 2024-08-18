export interface IFirebaseConfig {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId?: string
}

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
