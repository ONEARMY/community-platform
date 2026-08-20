import { UserRole } from 'oa-shared';
import type { MiddlewareFunction } from 'react-router';
import { requireAnyRole } from 'src/middleware/requireRole.server';
import { sessionMiddleware } from 'src/middleware/session.server';
import ResearchForm from 'src/pages/Research/Content/Common/ResearchForm';

export const middleware: MiddlewareFunction<Response>[] = [
  sessionMiddleware,
  requireAnyRole([UserRole.ADMIN, UserRole.RESEARCH_CREATOR], 'research-create'),
];

export default function Index() {
  return <ResearchForm formData={null} id={null} research={null} />;
}
