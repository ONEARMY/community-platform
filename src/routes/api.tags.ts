import { json } from '@remix-run/node'

// runs on the server
export async function loader() {
  // TODO: get tags from firebase and cache them

  return json(
    [
      {
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
        VITE_BRANCH: process.env.VITE_BRANCH,
        VITE_CDN_URL: process.env.VITE_CDN_URL,
        VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
        VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
        VITE_FIREBASE_DATABASE_URL: process.env.VITE_FIREBASE_DATABASE_URL,
        VITE_FIREBASE_MESSAGING_SENDER_ID:
          process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
        VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
        VITE_SENTRY_DSN: process.env.VITE_SENTRY_DSN,
        VITE_GA_TRACKING_ID: process.env.VITE_GA_TRACKING_ID,
        VITE_PATREON_CLIENT_ID: process.env.VITE_PATREON_CLIENT_ID,
        VITE_PLATFORM_THEME: process.env.VITE_PLATFORM_THEME,
        VITE_PROJECT_VERSION: process.env.VITE_PROJECT_VERSION,
        VITE_SUPPORTED_MODULES: process.env.VITE_SUPPORTED_MODULES,
      },
    ],
    { status: 501 },
  )
}
