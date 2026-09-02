import type { Question } from 'oa-shared';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface IProps {
  questions: Question[];
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
            <TableHead className="w-0">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Moderation</TableHead>
            <TableHead>Is Draft</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead>Comment Count</TableHead>
            <TableHead>Deleted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.title}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {question.description}
              </TableCell>
              <TableCell>{question.createdBy.toString()}</TableCell>
              <TableCell>{question.category !== null ? question.category : ''}</TableCell>
              <TableCell>{question.tags.join()}</TableCell>
              <TableCell>{}</TableCell>
              <TableCell>{question.isDraft}</TableCell>
              <TableCell>
                {question.publishedAt !== null ? question.publishedAt.toLocaleDateString() : ''}
              </TableCell>
              <TableCell>{question.commentCount}</TableCell>
              <TableCell>{question.deleted}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
