import { redirect } from '@remix-run/node'

const redirectSignIn = (returnUrl: string, headers: HeadersInit) => {
  return redirect(`/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`, {
    headers,
  })
}

export const redirectServiceServer = {
  redirectSignIn,
}
