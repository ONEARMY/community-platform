import { PencilIcon, TrashIcon } from 'lucide-react';
import type { AdminQuestion } from 'oa-shared';
import { useState } from 'react';
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
import { DeleteQuestionDialog } from './DeleteQuestionDialog';

interface IProps {
  questions: AdminQuestion[];
}

export function QuestionsPage({ questions }: IProps) {
  const [deletingQuestion, setDeletingQuestion] = useState<AdminQuestion | null>(null);

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
            <TableRow key={question.id} variant={question.deleted === true ? 'muted' : 'default'}>
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
                  <Link
                    className={question.deleted ? 'cursor-default' : ''}
                    to={question.deleted ? '' : '/questions/' + question.slug + '/edit'}
                  >
                    <Button
                      variant="ghost"
                      disabled={question.deleted ? true : false}
                      size="icon-sm"
                      aria-label={`Edit ${question.title}`}
                      onClick={() => {}}
                    >
                      <PencilIcon />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    disabled={question.deleted ? true : false}
                    size="icon-sm"
                    aria-label={`Delete ${question.title}`}
                    onClick={() => setDeletingQuestion(question)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteQuestionDialog
        question={deletingQuestion}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingQuestion(null);
          }
        }}
      />
    </div>
  );
}
