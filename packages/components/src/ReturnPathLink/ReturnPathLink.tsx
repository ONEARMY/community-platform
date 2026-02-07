import type { RefAttributes } from 'react';
import type { LinkProps } from 'react-router';
import { Link } from 'react-router';

type IProps = LinkProps & RefAttributes<HTMLAnchorElement>;

export const ReturnPathLink = (props: IProps) => {
  const to = `${props.to}?returnUrl=${encodeURIComponent(location?.pathname)}`;

  return (
    <Link {...props} to={to}>
      {props.children}
    </Link>
  );
};
