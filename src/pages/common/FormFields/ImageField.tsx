import styled from '@emotion/styled';
import { ImageInput, ImageInputDeleteImage, ImageInputWrapper } from 'oa-components';
import { FullMedia } from 'oa-shared';
import { useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { storageService } from 'src/services/storageService';
import { Image as ImageComponent, Spinner, Text } from 'theme-ui';

const ImageInputFieldWrapper = styled.div`
  height: 200px;
  width: 370px;
  max-width: 100%;
  margin-bottom: 6px;
`;

type ImageFieldProps = {
  title: string;
  contentType: 'projects' | 'research' | 'questions' | 'news';
  contentId?: number | null;
};

export const ImageField = (props: ImageFieldProps) => {
  const { title, contentType, contentId = null } = props;
  const state = useFormState<{ image: FullMedia | null }>();
  const form = useForm<{ image: FullMedia | null }>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageSelect = async (fileMeta: any) => {
    // If user is clearing the image
    if (!fileMeta || !fileMeta.photoData) {
      form.change('image', null);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload the image first
      const uploadedImage = await storageService.imageUpload(
        contentId,
        contentType,
        fileMeta.photoData,
      );

      // Only then set the form state with the uploaded metadata
      form.change('image', uploadedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormFieldWrapper htmlFor="image" text={title} required>
      {uploadError && <Text sx={{ color: 'error', fontSize: 1, mb: 2 }}>{uploadError}</Text>}
      {isUploading ? (
        <ImageInputFieldWrapper key="image-uploading" data-cy="image-uploading">
          <FieldContainer
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spinner />
            <Text sx={{ ml: 2 }}>Uploading image...</Text>
          </FieldContainer>
        </ImageInputFieldWrapper>
      ) : !state.values.image ? (
        <ImageInputFieldWrapper key="image-upload" data-cy="image-upload">
          <FieldContainer
            style={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <ImageInput hasText={false} value={undefined} onFilesChange={handleImageSelect} />
          </FieldContainer>
        </ImageInputFieldWrapper>
      ) : (
        <ImageInputFieldWrapper key="existing-image" data-cy="existing-image">
          <FieldContainer
            style={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <ImageInputWrapper hasUploadedImg={true}>
              <ImageComponent src={state.values.image?.publicUrl} />
              <ImageInputDeleteImage
                onClick={() => {
                  form.change('image', null);
                }}
              />
            </ImageInputWrapper>
          </FieldContainer>
        </ImageInputFieldWrapper>
      )}
    </FormFieldWrapper>
  );
};
