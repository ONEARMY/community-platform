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
            <TableHead className="w-0">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.title}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {question.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
