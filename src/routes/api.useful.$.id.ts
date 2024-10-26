import { json } from '@remix-run/node'

// runs on the server
export async function loader() {
  return json(
    [
      {
        test: 'tags',
      },
    ],
    { status: 501 },
  )
}
