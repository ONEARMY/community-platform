import { json } from '@remix-run/node'

// runs on the server
export async function loader() {
  // TODO: get tags from firebase and cache them

  return json(
    [
      {
        id: import.meta.env.REACT_APP_FIREBASE_DATABASE_URL,
        name: import.meta.env.VITE_SITE_NAME,
        test: process.env.VITE_SITE_NAME,
        test2: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        theme: process.env.VITE_THEME,
        theme2: import.meta.env.VITE_THEME,
      },
    ],
    { status: 501 },
  )
}
