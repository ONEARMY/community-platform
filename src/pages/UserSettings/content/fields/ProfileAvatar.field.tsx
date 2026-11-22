import type { MediaWithPublicUrl } from 'oa-shared';
import { type ChangeEvent, useRef, useState } from 'react';
import { useField } from 'react-final-form';
import { logger } from 'src/logger';
import { avatarField, fields } from 'src/pages/UserSettings/labels';
import { storageService } from 'src/services/storageService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import EditIcon from '@/components/ui/icons/edit.svg?react';
import { Spinner } from '@/components/ui/spinner';
import { SettingsField } from '../elements';

const ACCEPTED_FORMATS = '.jpeg,.jpg,.png,.gif,.svg,.webp';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface IProps {
  profileId: number;
  displayName: string;
}

export const ProfileAvatarField = ({ profileId, displayName }: IProps) => {
  const { input } = useField<MediaWithPublicUrl | undefined>('photo');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userImage } = fields;

  const openPicker = () => fileInputRef.current?.click();

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError(avatarField.invalid);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(avatarField.tooLarge);
      return;
    }

    setError(null);
    setIsUploading(true);
    try {
      input.onChange(await storageService.imageUpload(profileId, 'profiles', file));
    } catch (uploadError) {
      logger.error('Error uploading photo:', uploadError);
      setError(avatarField.uploadFailed);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SettingsField label={userImage.title} required>
      {error && (
        <p data-cy="photo-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-5">
        <div data-cy="userImage" data-testid="photo" className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FORMATS}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Avatar className="size-24">
            {input.value?.publicUrl && (
              <AvatarImage src={input.value.publicUrl} alt={displayName} />
            )}
            <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60">
              <Spinner />
            </div>
          )}
          <button
            type="button"
            aria-label={avatarField.change}
            onClick={openPicker}
            disabled={isUploading}
            className="absolute right-0 bottom-0 hidden size-7 cursor-pointer items-center justify-center rounded-full bg-softblue hover:bg-highlight-hover sm:flex"
          >
            <EditIcon className="size-4" />
          </button>
        </div>
        <Button
          type="button"
          variant="soft"
          onClick={openPicker}
          disabled={isUploading}
          className="sm:hidden"
        >
          {avatarField.change}
        </Button>
      </div>
    </SettingsField>
  );
};
