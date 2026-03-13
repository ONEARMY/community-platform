import type { FormApi } from 'final-form';
import { observer } from 'mobx-react';
import { ImageInputV2 } from 'oa-components';
import type { ProfileFormData } from 'oa-shared';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { fields, headings } from 'src/pages/UserSettings/labels';
import { storageService } from 'src/services/storageService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Box, Flex, Heading, Spinner, Text } from 'theme-ui';

interface IProps {
  values: ProfileFormData;
  isMemberProfile: boolean;
  form: FormApi<ProfileFormData, Partial<ProfileFormData>>;
}

export const UserImagesSection = observer(({ isMemberProfile, values, form }: IProps) => {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadingCoverIndex, setUploadingCoverIndex] = useState<number | null>(null);
  const { profile } = useProfileStore();

  // Always show 4 inputs: filled images first, then empty slots
  const filledImages = (values.coverImages || []).filter((img) => img);
  const emptySlots = Array(4 - filledImages.length).fill(null);
  const coverImageSlots = [...filledImages, ...emptySlots];

  const handlePhotoSelect = async (file: File | undefined) => {
    if (!file) {
      form.change('photo', undefined);
      return;
    }

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
    if (!file) {
      // Remove image at index
      const updatedImages = coverImageSlots.filter((_, i) => i !== index).filter((img) => img);
      form.change('coverImages', updatedImages);
      return;
    }

    try {
      setUploadingCoverIndex(index);
      const uploadedImage = await storageService.imageUpload(profile!.id, 'profiles' as any, file);

      const updatedSlots = [...coverImageSlots];
      updatedSlots[index] = uploadedImage;

      // Store only filled images, maintaining order
      const updatedImages = updatedSlots.filter((img) => img);
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
          ) : (
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <ImageInputV2 image={values.photo} onFilesChange={handlePhotoSelect} />
            </Box>
          )}
        </Box>
      </Flex>

      {!isMemberProfile && (
        <Flex data-testid="coverImages" sx={{ flexDirection: 'column', gap: 1 }}>
          <Heading variant="subHeading">
            {fields.coverImages.title} <Text color="red">*</Text>
          </Heading>
          <Text variant="paragraph">{fields.coverImages.description}</Text>

          <Field name="coverImages">
            {({ input }) => (
              <Flex>
                {coverImageSlots.map((image, index) => (
                  <Box
                    sx={{
                      width: '150px',
                      height: '100px',
                      marginRight: '10px',
                      position: 'relative',
                    }}
                    key={`cover-image-${index}`}
                    data-cy={`cover-image-${index}`}
                  >
                    {uploadingCoverIndex === index ? (
                      <Flex sx={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Spinner size={20} />
                      </Flex>
                    ) : (
                      <ImageInputV2
                        image={image}
                        onFilesChange={(file: File | undefined) =>
                          handleCoverImageSelect(file, index)
                        }
                      />
                    )}
                  </Box>
                ))}
              </Flex>
            )}
          </Field>
        </Flex>
      )}
    </Flex>
  );
});
