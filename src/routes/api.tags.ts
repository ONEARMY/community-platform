import { json } from '@remix-run/node'

// runs on the server
export async function loader() {
  // TODO: get tags from firebase and cache them

  return json(
    [
      {
        test: 'tags',
      },
    ],
    { status: 501 },
  )
}
