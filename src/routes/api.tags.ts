import { json } from '@remix-run/node'

// runs on the server
export async function loader() {
  // TODO: get tags from firebase and cache them

  return json(
    [
      {
        test: process.env.VITE_SITE_NAME,
        test2: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        theme: process.env.VITE_THEME,
        academy: process.env.VITE_ACADEMY_RESOURCE,
        VITE_ACADEMY_RESOURCE: process.env.VITE_ACADEMY_RESOURCE,
        VITE_PROFILE_GUIDELINES_URL: process.env.VITE_PROFILE_GUIDELINES_URL,
        VITE_SITE_NAME: process.env.VITE_SITE_NAME,
        VITE_THEME: process.env.VITE_THEME,
        VITE_DONATIONS_BODY: process.env.VITE_DONATIONS_BODY,
        VITE_DONATIONS_IFRAME_SRC: process.env.VITE_DONATIONS_IFRAME_SRC,
        VITE_DONATIONS_IMAGE_URL: process.env.VITE_DONATIONS_IMAGE_URL,
        VITE_HOWTOS_HEADING: process.env.VITE_HOWTOS_HEADING,
        VITE_COMMUNITY_PROGRAM_URL: process.env.VITE_COMMUNITY_PROGRAM_URL,
        VITE_QUESTIONS_GUIDELINES_URL:
          process.env.VITE_QUESTIONS_GUIDELINES_URL,
        REACT_APP_BRANCH: process.env.REACT_APP_BRANCH,
        REACT_APP_CDN_URL: process.env.REACT_APP_CDN_URL,
        REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
        REACT_APP_FIREBASE_AUTH_DOMAIN:
          process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        REACT_APP_FIREBASE_DATABASE_URL:
          process.env.REACT_APP_FIREBASE_DATABASE_URL,
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID:
          process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        REACT_APP_FIREBASE_PROJECT_ID:
          process.env.REACT_APP_FIREBASE_PROJECT_ID,
        REACT_APP_FIREBASE_STORAGE_BUCKET:
          process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        REACT_APP_SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
        REACT_APP_GA_TRACKING_ID: process.env.REACT_APP_GA_TRACKING_ID,
        REACT_APP_PATREON_CLIENT_ID: process.env.REACT_APP_PATREON_CLIENT_ID,
        REACT_APP_PLATFORM_THEME: process.env.REACT_APP_PLATFORM_THEME,
        REACT_APP_PROJECT_VERSION: process.env.REACT_APP_PROJECT_VERSION,
        REACT_APP_SUPPORTED_MODULES: process.env.REACT_APP_SUPPORTED_MODULES,
      },
    ],
    { status: 501 },
  )
}
