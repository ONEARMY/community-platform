import { type FormEvent, useEffect, useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface IProps {
  isOpen: boolean;
  comment: string;
  isReply?: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => Promise<Response>;
}

export function EditCommentDialog({ isOpen, comment, isReply = false, onClose, onSubmit }: IProps) {
  const [text, setText] = useState(comment);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setText(comment);
      setError(undefined);
    }
  }, [isOpen, comment]);

  const title = isReply ? 'Edit Reply' : 'Edit Comment';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const response = await onSubmit(text.trim());
    setSubmitting(false);

    if (response.ok) {
      onClose();
    } else {
      setError(response.statusText || 'Could not save the comment');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          {error && <Alert variant="destructive">{error}</Alert>}

          <Textarea
            aria-label={title}
            data-cy="edit-comment"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={4}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              data-cy="edit-comment-submit"
              disabled={!text.trim() || submitting}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
