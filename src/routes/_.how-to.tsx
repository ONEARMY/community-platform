/* eslint-disable unicorn/filename-case */

// The library/projects section use to be called 'how-tos' so this
// exists to ensure users get to the right place

import { redirect } from '@remix-run/node'

import type { LoaderFunctionArgs } from '@remix-run/node'

export function loader({ params }: LoaderFunctionArgs) {
  return redirect(`/library/${params.slug}`, 301)
}
