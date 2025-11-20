import { redirect } from 'react-router';

const redirectSignIn = (returnUrl: string, headers: HeadersInit) => {
  return redirect(`/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`, {
    headers,
  });
};

export const redirectServiceServer = {
  redirectSignIn,
};
