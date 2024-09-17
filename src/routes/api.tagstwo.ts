import { json } from '@remix-run/node'

// runs on the server
export async function loader() {
  // TODO: get tags from firebase and cache them

  return json(
    [
      {
        test: process.env.VITE_SITE_NAME,
        test2: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      },
    ],
    { status: 501 },
  )
}
