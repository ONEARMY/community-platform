export const getReturnUrl = (request: Request, fallbackPath: string = '/') => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  return params.has('returnUrl')
    ? decodeURIComponent(params.get('returnUrl') as string)
    : fallbackPath;
};
