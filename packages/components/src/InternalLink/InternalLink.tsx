import { forwardRef } from 'react';
import type { LinkProps as RouterLinkProps } from 'react-router';
import { Link as RouterLink } from 'react-router';
import type { LinkProps as ThemedUILinkProps } from 'theme-ui';
import { Link } from 'theme-ui';

export type Props = RouterLinkProps & ThemedUILinkProps;

export const InternalLink = forwardRef<HTMLButtonElement, Props>((props: Props, ref) => (
  <Link as={RouterLink} ref={ref as any} {...props}>
    {props.children}
  </Link>
));

InternalLink.displayName = 'InternalLink';
