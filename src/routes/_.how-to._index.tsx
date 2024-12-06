/* eslint-disable unicorn/filename-case */

// The library/projects section use to be called 'how-tos' so this
// exists to ensure users get to the right place

import { redirect } from '@remix-run/node'

export function loader() {
  return redirect('/library', 301)
}
