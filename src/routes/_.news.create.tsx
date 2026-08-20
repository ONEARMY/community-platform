import { UserRole } from 'oa-shared';
import type { MiddlewareFunction } from 'react-router';
import { UserAction } from 'src/common/UserAction';
import { requireAnyRole } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import { NewsForm } from 'src/pages/News/Content/Common/NewsForm';
import { listing } from 'src/pages/News/labels';
import { Box } from 'theme-ui';

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireAnyRole([UserRole.ADMIN, UserRole.EDITOR], 'news-create'),
];

export default function Index() {
  return (
    <UserAction
      incompleteProfile={
        <Box
          data-cy="incomplete-profile-message"
          sx={{
            alignSelf: 'center',
            paddingTop: 5,
          }}
        >
          {listing.incompleteProfile}
        </Box>
      }
      loggedIn={
        <NewsForm data-testid="news-create-form" formAction="create" formData={null} id={null} />
      }
      loggedOut={<></>}
    />
  );
}
