import type { AdminComment } from 'oa-shared';
import { type FormEvent, useState } from 'react';
import { useRevalidator } from 'react-router';
import { ErrorsContainer } from 'src/common/Form/ErrorsContainer';
import { commentService } from 'src/services/commentService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface IProps {
  comment: AdminComment;
  editing: boolean;
  onClose: () => void;
}

export function CommentDialog({ comment, editing, onClose }: IProps) {
  const [text, setText] = useState(comment.comment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const revalidator = useRevalidator();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || !text.trim() || comment.sourceId === null) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await commentService.editComment(comment.sourceId, comment.id, text);
      if (!response.ok) {
        throw new Error(response.statusText || 'Could not save this comment. Please try again.');
      }
      onClose();
      revalidator.revalidate();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Could not save this comment. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !submitting) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-dvh overflow-y-auto" showCloseButton={!submitting}>
        <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-4">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit' : 'View'} {comment.isReply ? 'reply' : 'comment'}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? 'Changes will update the comment on the site.'
                : 'This comment is not available at a live location.'}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div role="alert">
              <ErrorsContainer serverErrors={[error]} />
            </div>
          )}
          {editing ? (
            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="admin-comment-text">Comment</Label>
              <Textarea
                id="admin-comment-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                disabled={submitting}
                required
                className="max-h-80 resize-y"
              />
            </div>
          ) : (
            <p className="whitespace-pre-wrap wrap-anywhere">{comment.comment}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              {editing ? 'Cancel' : 'Close'}
            </Button>
            {editing && (
              <Button type="submit" disabled={submitting || !text.trim()}>
                {submitting ? 'Saving...' : 'Save'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
