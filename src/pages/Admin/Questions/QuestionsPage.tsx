import { PencilIcon, TrashIcon } from 'lucide-react';
import type { AdminQuestion } from 'oa-shared';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface IProps {
  questions: AdminQuestion[];
}

export function QuestionsPage({ questions }: IProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Questions</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Category</TableHead>
            {/* {<TableHead>Moderation</TableHead> */}
            <TableHead>Draft</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow
              key={question.id}
              className={question.deleted === true ? 'text-muted-foreground bg-gray-100' : ''}
            >
              <TableCell>
                <Link to={'/questions/' + question.slug}>{question.title}</Link>
              </TableCell>
              <TableCell>
                <Link to={'/u/' + question.authorUserName}>{question.authorDisplayName}</Link>
              </TableCell>
              <TableCell>{question.category !== null ? question.category.name : ''}</TableCell>
              {/* <TableCell>{question.moderation}</TableCell> */}
              <TableCell>{question.isDraft ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                {question.publishedAt !== null ? question.publishedAt.toLocaleDateString() : ''}
              </TableCell>
              <TableCell>{question.commentCount}</TableCell>
              <TableCell>{question.totalViews}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${question.title}`}
                    onClick={() => {}}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${question.title}`}
                    onClick={() => {}}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
