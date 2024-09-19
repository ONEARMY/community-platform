import { json } from '@remix-run/node'

// runs on the server
export async function loader() {
  // TODO: get tags from firebase and cache them

  return json(
    [
      {
        VITE_ACADEMY_RESOURCE: import.meta.env.VITE_ACADEMY_RESOURCE,
        VITE_PROFILE_GUIDELINES_URL: import.meta.env
          .VITE_PROFILE_GUIDELINES_URL,
        VITE_SITE_NAME: import.meta.env.VITE_SITE_NAME,
        VITE_THEME: import.meta.env.VITE_THEME,
        VITE_DONATIONS_BODY: import.meta.env.VITE_DONATIONS_BODY,
        VITE_DONATIONS_IFRAME_SRC: import.meta.env.VITE_DONATIONS_IFRAME_SRC,
        VITE_DONATIONS_IMAGE_URL: import.meta.env.VITE_DONATIONS_IMAGE_URL,
        VITE_HOWTOS_HEADING: import.meta.env.VITE_HOWTOS_HEADING,
        VITE_COMMUNITY_PROGRAM_URL: import.meta.env.VITE_COMMUNITY_PROGRAM_URL,
        VITE_QUESTIONS_GUIDELINES_URL: import.meta.env
          .VITE_QUESTIONS_GUIDELINES_URL,
        REACT_APP_BRANCH: import.meta.env.REACT_APP_BRANCH,
        REACT_APP_CDN_URL: import.meta.env.REACT_APP_CDN_URL,
        REACT_APP_FIREBASE_API_KEY: import.meta.env.REACT_APP_FIREBASE_API_KEY,
        REACT_APP_FIREBASE_AUTH_DOMAIN: import.meta.env
          .REACT_APP_FIREBASE_AUTH_DOMAIN,
        REACT_APP_FIREBASE_DATABASE_URL: import.meta.env
          .REACT_APP_FIREBASE_DATABASE_URL,
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID: import.meta.env
          .REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        REACT_APP_FIREBASE_PROJECT_ID: import.meta.env
          .REACT_APP_FIREBASE_PROJECT_ID,
        REACT_APP_FIREBASE_STORAGE_BUCKET: import.meta.env
          .REACT_APP_FIREBASE_STORAGE_BUCKET,
        REACT_APP_SENTRY_DSN: import.meta.env.REACT_APP_SENTRY_DSN,
        REACT_APP_GA_TRACKING_ID: import.meta.env.REACT_APP_GA_TRACKING_ID,
        REACT_APP_PATREON_CLIENT_ID: import.meta.env
          .REACT_APP_PATREON_CLIENT_ID,
        REACT_APP_PLATFORM_THEME: import.meta.env.REACT_APP_PLATFORM_THEME,
        REACT_APP_PROJECT_VERSION: import.meta.env.REACT_APP_PROJECT_VERSION,
        REACT_APP_SUPPORTED_MODULES: import.meta.env
          .REACT_APP_SUPPORTED_MODULES,
      },
    ],
    { status: 501 },
  )
}
