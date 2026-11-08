import type { AdminProject } from 'oa-shared';
import { DifficultyLevelRecord } from 'oa-shared';
import { Link } from 'react-router';
import { AdminPagination } from 'src/pages/Admin/AdminPagination';
import { ModerationBadge } from 'src/pages/Admin/ModerationBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PUBLISHED_AT_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

interface IProps {
  projects: AdminProject[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export function ProjectsPage({ projects, page, totalPages, totalCount }: IProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Projects</h1>
        <span className="text-sm text-muted-foreground">Total: {totalCount}</span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Moderation</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Steps</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Remakes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} variant="muted" className="h-24 text-center">
                No projects yet.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id} variant={project.deleted ? 'muted' : 'default'}>
                <TableCell>
                  {project.deleted ? (
                    `${project.title} (marked for deletion)`
                  ) : (
                    <Link to={`/library/${project.slug}`} className="font-medium hover:underline">
                      {project.title}
                    </Link>
                  )}
                </TableCell>
                <TableCell>
                  {!project.author ? (
                    <span className="text-muted-foreground">Author unavailable</span>
                  ) : project.author.username ? (
                    <Link to={`/u/${project.author.username}`} className="hover:underline">
                      {project.author.displayName}
                    </Link>
                  ) : (
                    project.author.displayName
                  )}
                </TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>
                  {project.difficultyLevel && DifficultyLevelRecord[project.difficultyLevel]}
                </TableCell>
                <TableCell>
                  {project.moderation && <ModerationBadge status={project.moderation} />}
                </TableCell>
                <TableCell>
                  {project.isDraft
                    ? 'Draft'
                    : project.publishedAt && PUBLISHED_AT_FORMAT.format(project.publishedAt)}
                </TableCell>
                <TableCell>{project.stepCount}</TableCell>
                <TableCell>{project.commentCount}</TableCell>
                <TableCell>{project.totalViews}</TableCell>
                <TableCell>{project.remakeCount}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AdminPagination page={page} totalPages={totalPages} />
    </div>
  );
}
