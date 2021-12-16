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

export interface IAlgoliaConfig {
    searchOnlyAPIKey: string
    applicationID: string
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __OA_COMMUNITY_PLATFORM_CONFIGURATION: any;
    }
}

export type siteVariants =
    | 'emulated_site'
    | 'dev_site'
    | 'test-ci'
    | 'staging'
    | 'production'
    | 'preview'
