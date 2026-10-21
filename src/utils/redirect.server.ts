export const getReturnUrl = (request: Request, fallbackPath: string = '/') => {
  const url = new URL(request.url);
  const returnUrl = url.searchParams.get('returnUrl');

  if (!returnUrl) {
    return fallbackPath;
  }

  const path = decodeURIComponent(returnUrl);

  return isSameOriginPath(path, url.origin) ? path : fallbackPath;
};

const isSameOriginPath = (path: string, origin: string) =>
  path.startsWith('/') && new URL(path, origin).origin === origin;

export const getEmailConfirmationUrl = (request: Request, isOrganisation = false) => {
  const url = new URL(request.url);
  const protocol = url.host.startsWith('localhost') ? 'http:' : 'https:';
  const search = isOrganisation ? '?flow=organisation' : '';

  return `${protocol}//${url.host}/email-confirmation${search}`;
};
