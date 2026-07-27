import { ImageInputV2 } from 'oa-components';
import type { ProjectFormData } from 'oa-shared';
import { commonStyles } from 'oa-themes';
import { useState } from 'react';
import { Field, useForm } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { storageService } from 'src/services/storageService';
import { required } from 'src/utils/validators';
import { Box, Spinner, Text } from 'theme-ui';

type ImageFieldProps = {
  title: string;
  contentType: 'projects' | 'research' | 'questions' | 'news';
  contentId?: number | null;
};

export const ImageField = (props: ImageFieldProps) => {
  const { title, contentType, contentId = null } = props;
  const form = useForm<ProjectFormData>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageSelect = async (file: File | undefined) => {
    // If user is clearing the image
    if (!file) {
      form.change('coverImage', null);
      setUploadError(null);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload the image first
      const uploadedImage = await storageService.imageUpload(contentId, contentType, file);

      // Only then set the form state with the uploaded metadata
      form.change('coverImage', uploadedImage);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
      );
      form.change('coverImage', null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Field name="coverImage" validate={required}>
      {({ input, meta }) => (
        <FormFieldWrapper htmlFor="image" text={title} required>
          {uploadError && <Text sx={{ color: 'error', fontSize: 1, mb: 2 }}>{uploadError}</Text>}
          {meta.touched && meta.error && (
            <Text sx={{ color: 'error', fontSize: 1, mb: 2 }}>{meta.error}</Text>
          )}

          <Box
            sx={{
              height: '200px',
              width: '370px',
              maxWidth: '100%',
              ...(meta.touched && meta.error
                ? { '.image-input__wrapper': { borderColor: 'error' } }
                : {}),
            }}
            data-cy={isUploading ? 'image-uploading' : 'image-input'}
          >
            <FieldContainer
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isUploading ? (
                <>
                  <Spinner sx={{ color: commonStyles.colors.darkGrey }} />
                  <Text sx={{ ml: 2 }}>Uploading image...</Text>
                </>
              ) : (
                <ImageInputV2
                  onFilesChange={handleImageSelect}
                  onError={setUploadError}
                  image={input.value || undefined}
                />
              )}
            </FieldContainer>
          </Box>
        </FormFieldWrapper>
      )}
    </Field>
  );
};
