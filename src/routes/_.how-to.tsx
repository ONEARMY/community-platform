/* eslint-disable unicorn/filename-case */

// The library/projects section use to be called 'how-tos' so this
// exists to ensure users get to the right place

import { redirect } from 'react-router'

import type { LoaderFunctionArgs } from 'react-router'

export function loader({ params }: LoaderFunctionArgs) {
  return redirect(`/library/${params.slug}`, 301)
}
