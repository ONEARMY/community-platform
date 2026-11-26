import { ImageInputV2 } from 'oa-components';
import type { MediaWithPublicUrl } from 'oa-shared';
import { useState } from 'react';
import { useField } from 'react-final-form';
import { logger } from 'src/logger';
import { fields } from 'src/pages/UserSettings/labels';
import { storageService } from 'src/services/storageService';
import { Spinner } from '@/components/ui/spinner';
import { SettingsField } from '../elements';

const MAX_COVER_IMAGES = 4;

interface IProps {
  profileId: number;
}

export const CoverImagesField = ({ profileId }: IProps) => {
  const { input } = useField<(MediaWithPublicUrl | null)[] | undefined>('coverImages');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filledImages = (input.value || []).filter((image) => image);
  const slots = [...filledImages, ...Array(MAX_COVER_IMAGES - filledImages.length).fill(null)];

  const handleSelect = async (file: File | undefined, index: number) => {
    if (!file) {
      input.onChange(slots.filter((image, i) => i !== index && image));
      return;
    }

    try {
      setUploadingIndex(index);
      const updatedSlots = [...slots];
      updatedSlots[index] = await storageService.imageUpload(profileId, 'profiles', file);
      input.onChange(updatedSlots.filter((image) => image));
    } catch (uploadError) {
      logger.error('Error uploading cover image:', uploadError);
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <SettingsField
      label={fields.coverImages.title}
      description={fields.coverImages.description}
      required
      data-testid="coverImages"
    >
      {error && (
        <p data-cy="cover-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {slots.map((image, index) => (
          <div key={`cover-image-${index}`} data-cy={`coverImages-${index}`} className="aspect-3/2">
            {uploadingIndex === index ? (
              <Spinner className="h-full items-center" />
            ) : (
              <ImageInputV2
                image={image || undefined}
                onFilesChange={(file: File | undefined) => handleSelect(file, index)}
                onError={setError}
              />
            )}
          </div>
        ))}
      </div>
    </SettingsField>
  );
};
