export const getReturnUrl = (request: Request, fallbackPath: string = '/') => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  return params.has('returnUrl')
    ? decodeURIComponent(params.get('returnUrl') as string)
    : fallbackPath;
};

export const getEmailConfirmationUrl = (request: Request, isOrganisation = false) => {
  const url = new URL(request.url);
  const protocol = url.host.startsWith('localhost') ? 'http:' : 'https:';
  const search = isOrganisation ? '?flow=organisation' : '';

  return `${protocol}//${url.host}/email-confirmation${search}`;
};
