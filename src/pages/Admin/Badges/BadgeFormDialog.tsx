import { ImageOffIcon } from 'lucide-react';
import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { useRevalidator } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { ImagePickerDialog } from 'src/pages/common/ImagePicker/ImagePickerDialog';
import { ProfileBadgeService } from 'src/services/profileBadgeService';
import type { AdminProfileBadge, ProfileBadgeInput } from 'src/utils/profileBadges';
import {
  BADGE_AVAILABILITY_OPTIONS,
  canGrant,
  getAudienceLockReason,
  getProfileBadgeErrors,
  normalizeProfileBadgeInput,
} from 'src/utils/profileBadges';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import InformationIcon from '@/components/ui/icons/information.svg?react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface IProps {
  open: boolean;
  profileBadge: AdminProfileBadge | null;
  profileBadges: AdminProfileBadge[];
  onOpenChange: (open: boolean) => void;
}

type Field = keyof ProfileBadgeInput;

const NONE = 'none';

const emptyForm = {
  name: '',
  displayName: '',
  imageUrl: '',
  actionUrl: '',
  isAudience: true,
  grantsBadgeId: NONE,
  availableTo: NONE,
  actionLabel: '',
};

const AVAILABILITY_OPTIONS = [{ value: NONE, label: 'Not offered' }, ...BADGE_AVAILABILITY_OPTIONS];

const errorId = (id: string) => `${id}-error`;

const invalidProps = (id: string, error?: string) =>
  error ? { 'aria-invalid': true, 'aria-describedby': errorId(id) } : {};

function FieldHint({ children }: { children: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span tabIndex={0} />}
        aria-label={children}
        className="inline-flex text-muted-foreground"
      >
        <InformationIcon className="size-4" />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

function FormField({ id, label, hint, error, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id}>
          {label}
          {required && (
            <span aria-hidden className="text-destructive">
              *
            </span>
          )}
        </Label>
        {hint && <FieldHint>{hint}</FieldHint>}
      </div>
      {children}
      {error && (
        <p id={errorId(id)} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function BadgeFormDialog({ open, profileBadge, profileBadges, onOpenChange }: IProps) {
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const revalidator = useRevalidator();
  const toast = useToast();

  useEffect(() => {
    if (open) {
      const badge = profileBadge?.badge;

      setForm(
        badge
          ? {
              name: badge.name,
              displayName: badge.displayName,
              imageUrl: badge.imageUrl ?? '',
              actionUrl: badge.actionUrl ?? '',
              isAudience: badge.isAudience !== false,
              grantsBadgeId: badge.grantsBadgeId ? String(badge.grantsBadgeId) : NONE,
              availableTo: badge.availableTo ?? NONE,
              actionLabel: badge.actionLabel ?? '',
            }
          : emptyForm,
      );
      setTouched({});
      setSubmitted(false);
    }
  }, [open, profileBadge]);

  const badgeId = profileBadge?.badge.id;
  const isEditing = !!profileBadge;
  const allBadges = profileBadges.map(({ badge }) => badge);
  const audienceLockReason =
    profileBadge?.badge.isAudience !== false && profileBadge
      ? getAudienceLockReason(profileBadge, allBadges)
      : '';
  const grantOptions = [
    { value: NONE, label: 'None' },
    ...allBadges
      .filter((badge) => canGrant(allBadges, badgeId, badge.id))
      .map((badge) => ({ value: String(badge.id), label: badge.displayName })),
  ];
  const isOffered = form.isAudience && form.availableTo !== NONE;

  const input = normalizeProfileBadgeInput({
    ...form,
    grantsBadgeId: form.grantsBadgeId === NONE ? null : form.grantsBadgeId,
    availableTo: form.availableTo === NONE ? null : form.availableTo,
  });
  const inputErrors = getProfileBadgeErrors(input, profileBadges, badgeId);
  const errors: Partial<Record<Field, string>> = {};

  for (const { field, message } of inputErrors) {
    if ((submitted || touched[field]) && !errors[field]) {
      errors[field] = message;
    }
  }

  const touch = (field: Field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (inputErrors.length) {
      return;
    }

    setSubmitting(true);

    const promise = (
      badgeId
        ? ProfileBadgeService.updateProfileBadge(badgeId, input)
        : ProfileBadgeService.createProfileBadge(input)
    ).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: isEditing ? 'Saving badge...' : 'Creating badge...',
      success: () => {
        onOpenChange(false);
        revalidator.revalidate();
        return isEditing ? 'Badge saved' : 'Badge created';
      },
      error: (error) => error.message || 'Something went wrong',
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-11/12 overflow-y-auto sm:max-w-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit badge' : 'New badge'}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="badge-name"
                label="Name"
                hint="Lowercase letters, numbers and dashes. It can't be changed later."
                error={errors.name}
                required={!isEditing}
              >
                <Input
                  id="badge-name"
                  value={form.name}
                  disabled={isEditing}
                  onChange={(event) => setForm((f) => ({ ...f, name: event.target.value }))}
                  onBlur={touch('name')}
                  {...invalidProps('badge-name', errors.name)}
                />
              </FormField>

              <FormField
                id="badge-display-name"
                label="Display Name"
                error={errors.displayName}
                required
              >
                <Input
                  id="badge-display-name"
                  value={form.displayName}
                  onChange={(event) => setForm((f) => ({ ...f, displayName: event.target.value }))}
                  onBlur={touch('displayName')}
                  {...invalidProps('badge-display-name', errors.displayName)}
                />
              </FormField>

              <FormField id="badge-image" label="Image" error={errors.imageUrl} required>
                <div className="flex items-center gap-3">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="" className="size-10 rounded-md object-contain" />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <ImageOffIcon className="size-5" />
                    </div>
                  )}
                  <Button
                    id="badge-image"
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPickerOpen(true)}
                    {...invalidProps('badge-image', errors.imageUrl)}
                  >
                    Choose image
                  </Button>
                </div>
              </FormField>

              <FormField
                id="badge-action-url"
                label="Link"
                hint="Opens when the badge is clicked on a profile, and from the buy button."
                error={errors.actionUrl}
                required={isOffered}
              >
                <Input
                  id="badge-action-url"
                  value={form.actionUrl}
                  placeholder="https://... or /support"
                  onChange={(event) => setForm((f) => ({ ...f, actionUrl: event.target.value }))}
                  onBlur={touch('actionUrl')}
                  {...invalidProps('badge-action-url', errors.actionUrl)}
                />
              </FormField>

              <FormField
                id="badge-grants"
                label="Grants Access To"
                hint="Holders of this badge can also read news restricted to the chosen badge."
                error={errors.grantsBadgeId}
              >
                <Select
                  items={grantOptions}
                  value={form.grantsBadgeId}
                  onValueChange={(value) =>
                    setForm((f) => ({ ...f, grantsBadgeId: value as string }))
                  }
                >
                  <SelectTrigger
                    id="badge-grants"
                    className="w-full"
                    {...invalidProps('badge-grants', errors.grantsBadgeId)}
                  >
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {grantOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              {profileBadge?.badge.premiumTier && (
                <FormField
                  id="badge-premium-tier"
                  label="Premium Tier"
                  hint="Set by the Stripe tier setup and used to unlock premium features."
                >
                  <Input id="badge-premium-tier" value={profileBadge.badge.premiumTier} disabled />
                </FormField>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="badge-is-audience" weight="normal">
                  <Checkbox
                    id="badge-is-audience"
                    checked={form.isAudience}
                    disabled={!!audienceLockReason}
                    onCheckedChange={(checked) =>
                      setForm((f) => ({
                        ...f,
                        isAudience: checked,
                        availableTo: checked ? f.availableTo : NONE,
                        actionLabel: checked ? f.actionLabel : '',
                      }))
                    }
                  />
                  <span className="text-sm">Can restrict news</span>
                </Label>
                <FieldHint>Editors can limit news articles to holders of this badge.</FieldHint>
              </div>
              {audienceLockReason && (
                <p className="text-sm text-muted-foreground">{`Locked: ${audienceLockReason}.`}</p>
              )}
              {errors.isAudience && <p className="text-sm text-destructive">{errors.isAudience}</p>}
            </div>

            {form.isAudience && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="badge-available-to"
                  label="Offered To"
                  hint="Shows a buy button on profiles of this kind, and blurred previews of its news."
                  error={errors.availableTo}
                >
                  <Select
                    items={AVAILABILITY_OPTIONS}
                    value={form.availableTo}
                    onValueChange={(value) =>
                      setForm((f) => ({ ...f, availableTo: value as string }))
                    }
                  >
                    <SelectTrigger
                      id="badge-available-to"
                      className="w-full"
                      {...invalidProps('badge-available-to', errors.availableTo)}
                    >
                      <SelectValue placeholder="Not offered" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                {isOffered && (
                  <FormField
                    id="badge-action-label"
                    label="Button Label"
                    error={errors.actionLabel}
                    required
                  >
                    <Input
                      id="badge-action-label"
                      value={form.actionLabel}
                      placeholder="Become a member"
                      onChange={(event) =>
                        setForm((f) => ({ ...f, actionLabel: event.target.value }))
                      }
                      onBlur={touch('actionLabel')}
                      {...invalidProps('badge-action-label', errors.actionLabel)}
                    />
                  </FormField>
                )}
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {isEditing ? 'Save' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ImagePickerDialog
        open={pickerOpen}
        path="badges"
        onOpenChange={setPickerOpen}
        onSelect={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
      />
    </>
  );
}
