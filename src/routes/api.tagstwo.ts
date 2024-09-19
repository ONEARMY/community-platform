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
        VITE_BRANCH: import.meta.env.VITE_BRANCH,
        VITE_CDN_URL: import.meta.env.VITE_CDN_URL,
        VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
        VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        VITE_FIREBASE_DATABASE_URL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
        VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env
          .VITE_FIREBASE_MESSAGING_SENDER_ID,
        VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        VITE_FIREBASE_STORAGE_BUCKET: import.meta.env
          .VITE_FIREBASE_STORAGE_BUCKET,
        VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
        VITE_GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID,
        VITE_PATREON_CLIENT_ID: import.meta.env.VITE_PATREON_CLIENT_ID,
        VITE_PLATFORM_THEME: import.meta.env.VITE_PLATFORM_THEME,
        VITE_PROJECT_VERSION: import.meta.env.VITE_PROJECT_VERSION,
        VITE_SUPPORTED_MODULES: import.meta.env.VITE_SUPPORTED_MODULES,
      },
    ],
    { status: 501 },
  )
}
