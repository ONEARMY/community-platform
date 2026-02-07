import { observer } from 'mobx-react';
import { BlockedRoute } from 'oa-components';
import type { UserRole } from 'oa-shared';
import { Navigate } from 'react-router';
import { AuthWrapper } from 'src/common/AuthWrapper';

/*
    This provides a <AuthRoute /> component that can be used in place of <Route /> components
    to allow user access only if authenticated.
*/

export const AuthRoute = observer(
  (props: {
    roleRequired?: UserRole | UserRole[];
    /** Page to redirect if role not satisfied (default shows message) */
    redirect?: string;
    children: React.ReactNode;
  }) => {
    const { roleRequired, redirect, children } = props;

    return (
      <AuthWrapper
        roleRequired={roleRequired}
        fallback={
          redirect ? (
            <Navigate to={redirect} />
          ) : (
            <BlockedRoute>
              {roleRequired
                ? `${roleRequired} role required to access this page. Please contact an admin.`
                : 'Please login to access this page'}
            </BlockedRoute>
          )
        }
      >
        {children}
      </AuthWrapper>
    );
  },
);
