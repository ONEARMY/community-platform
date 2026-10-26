import { ModerationRecord } from 'oa-components';
import type { AdminOrganisation, Moderation } from 'oa-shared';
import { type FormEvent, useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { profileService } from 'src/services/profileService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FEEDBACK_REQUIRED, MODERATIONS } from './moderation';

interface IProps {
  organisation: AdminOrganisation | null;
  onOpenChange: (open: boolean) => void;
}

const MODERATION_OPTIONS = MODERATIONS.map((value) => ({
  value,
  label: ModerationRecord[value],
}));

export function ModerateOrganisationDialog({ organisation, onOpenChange }: IProps) {
  const [moderation, setModeration] = useState<Moderation>('awaiting-moderation');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  useEffect(() => {
    if (organisation) {
      setModeration(organisation.moderation);
      setFeedback(organisation.moderationFeedback ?? '');
    }
  }, [organisation]);

  const isFeedbackRequired = FEEDBACK_REQUIRED.includes(moderation);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!organisation || (isFeedbackRequired && !feedback.trim())) {
      return;
    }

    setSubmitting(true);

    const promise = profileService
      .moderateOrganisation(organisation.id, moderation, feedback)
      .finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: 'Saving moderation...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return 'Moderation saved';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <Dialog open={!!organisation} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Moderate {organisation?.displayName}</DialogTitle>
          </DialogHeader>

          {organisation?.isMapPin && (
            <p className="text-sm text-muted-foreground">
              This organisation joined before the new signup flow, so only its map pin is moderated.
              Its profile stays public.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="organisation-moderation">Status</Label>
            <Select
              items={MODERATION_OPTIONS}
              value={moderation}
              onValueChange={(value) => setModeration(value as Moderation)}
            >
              <SelectTrigger id="organisation-moderation" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODERATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="organisation-feedback">
              Feedback {isFeedbackRequired ? '(required)' : '(optional)'}
            </Label>
            <Textarea
              id="organisation-feedback"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Notes for the organisation"
              required={isFeedbackRequired}
            />
            <p className="text-sm text-muted-foreground">
              {moderation === 'awaiting-moderation'
                ? 'No email is sent for this status.'
                : 'The organisation is emailed if the status or feedback changes. Feedback is included for Improvements needed and Rejected.'}
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
