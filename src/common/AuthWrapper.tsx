import { observer } from 'mobx-react';
import type { UserRole } from 'oa-shared';
import React from 'react';
import { useProfileStore } from 'src/stores/Profile/profile.store';

/*
    Simple wrapper to only render a component if the user is logged in (plus optional user role required)
    Optionally provide a fallback component to render if not satisfied
*/
interface IProps {
  children: React.ReactNode;
  borderLess?: boolean;
  fallback?: React.ReactNode;
  roleRequired?: UserRole | UserRole[];
}

export const AuthWrapper = observer((props: IProps) => {
  const { borderLess, children, roleRequired } = props;
  const { isUserAuthorized } = useProfileStore();
  const isAuthorized = isUserAuthorized(roleRequired);

  const childElements =
    roleRequired === 'beta-tester' && !borderLess ? (
      <div className="beta-tester-feature">{children}</div>
    ) : (
      props.children
    );

  return <>{isAuthorized ? childElements : props.fallback || <></>}</>;
});
