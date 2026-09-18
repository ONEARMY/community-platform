import type { AdminQuestion } from 'oa-shared';
import { useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { questionService } from 'src/services/questionService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface IProps {
  question: AdminQuestion | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteQuestionDialog({ question, onOpenChange }: IProps) {
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  const handleDelete = () => {
    if (!question) {
      return;
    }

    setSubmitting(true);

    const promise = questionService.deleteQuestion(question.id).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: 'Deleting category...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return 'Category deleted';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <Dialog open={!!question} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{question?.title}"? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
