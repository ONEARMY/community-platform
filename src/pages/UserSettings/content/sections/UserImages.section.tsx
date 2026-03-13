import type { FormApi } from 'final-form';
import { observer } from 'mobx-react';
import { ImageInputDeleteImage, ImageInputV2 } from 'oa-components';
import type { ProfileFormData } from 'oa-shared';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { fields, headings } from 'src/pages/UserSettings/labels';
import { storageService } from 'src/services/storageService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Box, Flex, Heading, Image as ImageComponent, Spinner, Text } from 'theme-ui';

interface IProps {
  values: ProfileFormData;
  isMemberProfile: boolean;
  form: FormApi<ProfileFormData, Partial<ProfileFormData>>;
}

export const UserImagesSection = observer(({ isMemberProfile, values, form }: IProps) => {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadingCoverIndex, setUploadingCoverIndex] = useState<number | null>(null);
  const { profile } = useProfileStore();

  const numberOfImageInputsAvailable = 4 - (values.coverImages?.filter((x) => !!x)?.length || 0);

  const handlePhotoSelect = async (file: File | undefined) => {
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const uploadedImage = await storageService.imageUpload(profile!.id, 'profiles', file);
      form.change('photo', uploadedImage);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleCoverImageSelect = async (file: File | undefined, index: number) => {
    if (!file) return;

    try {
      setUploadingCoverIndex(index);
      const uploadedImage = await storageService.imageUpload(profile!.id, 'profiles' as any, file);

      const currentExistingImages = values.coverImages || [];
      const updatedImages = [...currentExistingImages, uploadedImage];

      form.change('coverImages', updatedImages);
    } catch (error) {
      console.error('Error uploading cover image:', error);
    } finally {
      setUploadingCoverIndex(null);
    }
  };

  return (
    <Flex sx={{ flexDirection: 'column', gap: 3 }}>
      <Heading as="h2">{isMemberProfile ? fields.userImage.title : headings.images}</Heading>

      <Flex sx={{ flexDirection: 'column', alignContent: 'stretch', gap: 1 }}>
        {!isMemberProfile && (
          <Heading variant="subHeading">
            {fields.userImage.title} <Text color="red">*</Text>
          </Heading>
        )}
        <Text variant="paragraph">{fields.userImage.description}</Text>

        <Box
          data-testid="photo"
          sx={{
            width: '120px',
            height: '120px',
          }}
        >
          {isUploadingPhoto ? (
            <Flex sx={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spinner size={32} />
            </Flex>
          ) : !values.photo ? (
            <ImageInputV2 onFilesChange={handlePhotoSelect} />
          ) : (
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <ImageComponent
                src={values.photo?.fullPath}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <ImageInputDeleteImage
                onClick={() => {
                  form.change('photo', undefined);
                }}
              />
            </Box>
          )}
        </Box>
      </Flex>

      {!isMemberProfile && (
        <Flex data-testid="coverImage" sx={{ flexDirection: 'column', gap: 1 }}>
          <Heading variant="subHeading">
            {fields.coverImages.title} <Text color="red">*</Text>
          </Heading>
          <Text variant="paragraph">{fields.coverImages.description}</Text>

          <Flex>
            <Field name="existingCoverImages">
              {({ input }) => (
                <Flex>
                  {values.coverImages?.map((image, index) => (
                    <Box
                      sx={{
                        width: '150px',
                        height: '100px',
                        marginRight: '10px',
                        position: 'relative',
                      }}
                      key={`existing-image-${index}`}
                      data-cy={`existing-image-${index}`}
                    >
                      <ImageComponent
                        src={image.fullPath}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <ImageInputDeleteImage
                        onClick={() => {
                          const currentImages = input.value || [];
                          const updatedImages = currentImages.filter((_, i) => i !== index);
                          input.onChange(updatedImages);
                        }}
                      />
                    </Box>
                  ))}
                </Flex>
              )}
            </Field>

            <Flex>
              {[...Array(numberOfImageInputsAvailable)].map((_, i) => (
                <Box
                  key={`coverImages${i}`}
                  sx={{
                    width: '150px',
                    height: '100px',
                    marginRight: '10px',
                  }}
                >
                  {uploadingCoverIndex === i ? (
                    <Flex sx={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Spinner size={20} />
                    </Flex>
                  ) : (
                    <ImageInputV2 onFilesChange={(file) => handleCoverImageSelect(file, i)} />
                  )}
                </Box>
              ))}
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
});
