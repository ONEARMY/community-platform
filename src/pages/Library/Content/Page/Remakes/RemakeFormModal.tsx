import { Button, ConfirmModal, Icon, ImageInputV2, Modal, Username } from 'oa-components';
import type { MediaWithPublicUrl, Project, Remake } from 'oa-shared';
import { DBMedia, REMAKE_MAX_DESCRIPTION_LENGTH, REMAKE_MAX_IMAGES } from 'oa-shared';
import { useMemo, useState } from 'react';
import { ErrorsContainer } from 'src/common/Form/ErrorsContainer';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { ImageInputFieldWrapper } from 'src/pages/common/FormFields/ImageInputFieldWrapper';
import { remakeService } from 'src/services/remakeService';
import { storageService } from 'src/services/storageService';
import { Box, Flex, Image, Spinner, Text, Textarea } from 'theme-ui';
import { REMAKE_DELETE_CONFIRM_MESSAGE } from './constants';

interface IProps {
  project: Project;
  remake: Remake | null;
  onClose: () => void;
  onCreated: (remake: Remake) => void;
  onUpdated: (remake: Remake) => void;
  onDeleted: (remakeId: number) => void;
}

export const RemakeFormModal = (props: IProps) => {
  const { project, remake, onClose, onCreated, onUpdated, onDeleted } = props;

  const [images, setImages] = useState<MediaWithPublicUrl[]>(remake?.images || []);
  const [description, setDescription] = useState(remake?.description || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!remake;

  const isDirty = useMemo(() => {
    const initialImageIds = (remake?.images || []).map((image) => image.id).join();
    const initialDescription = remake?.description || '';

    return (
      images.map((image) => image.id).join() !== initialImageIds ||
      description !== initialDescription
    );
  }, [images, description, remake]);

  const handleImageSelect = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setImagesError(null);
    setSubmitError(null);

    try {
      const uploadedImage = await storageService.imageUpload(project.id, 'projects', file);
      setImages((currentImages) => {
        const uniqueImagesMap = new Map(
          [...currentImages, uploadedImage].map((image) => [image.id, image]),
        );
        return Array.from(uniqueImagesMap.values());
      });
    } catch (error) {
      setImagesError(
        error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (imageIndex: number) => {
    setImages((currentImages) => currentImages.filter((_, index) => index !== imageIndex));
  };

  const handleDismiss = () => {
    if (isDirty) {
      setShowLeaveConfirm(true);
      return;
    }

    onClose();
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (images.length === 0) {
      setImagesError('Upload at least 1 image');
      setSubmitError('Image: upload at least 1 image');
      return;
    }

    setIsSubmitting(true);

    try {
      const dto = {
        images: images.map((image) => DBMedia.fromPublicMedia(image)),
        description: description || null,
      };

      const response = isEditing
        ? await remakeService.updateRemake(project.id, remake.id, dto)
        : await remakeService.createRemake(project.id, dto);

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setSubmitError(body?.error || 'Something went wrong. Please try again.');
        return;
      }

      const body = (await response.json()) as { remake: Remake };

      if (isEditing) {
        onUpdated(body.remake);
      } else {
        onCreated(body.remake);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!remake || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await remakeService.deleteRemake(project.id, remake.id);

      if (response.status === 204) {
        onDeleted(remake.id);
      } else {
        setSubmitError('Error deleting remake. Please try again.');
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Modal
      isOpen
      onDismiss={handleDismiss}
      maxWidth="100vw"
      sx={{ width: ['100vw', '586px', '586px'], paddingX: 3, paddingY: 4 }}
    >
      <Flex
        data-cy="remake-form-modal"
        sx={{ flexDirection: 'column', gap: 4, maxHeight: '85vh', overflowY: 'auto' }}
      >
        <Flex sx={{ alignItems: 'center', gap: 3 }}>
          <Text sx={{ fontFamily: 'title', fontSize: 5 }}>
            {isEditing ? 'Edit remake' : 'Add your remake'}
          </Text>
          <Icon glyph="remake" size={24} />
          <Button
            type="button"
            variant="subtle"
            icon="close"
            showIconOnly
            data-cy="remake-form-close"
            onClick={handleDismiss}
            sx={{ marginLeft: 'auto', width: '44px', height: '44px', padding: 0 }}
          >
            Close
          </Button>
        </Flex>

        <Flex
          sx={{
            flexDirection: 'column',
            gap: 2,
            backgroundColor: 'softblue',
            borderRadius: 1,
            padding: 3,
          }}
        >
          <Text sx={{ fontFamily: 'title', fontSize: 2 }}>Source project</Text>
          <Flex sx={{ gap: 2, alignItems: 'center' }}>
            {project.coverImage?.publicUrl && (
              <Image
                src={project.coverImage.publicUrl}
                alt={project.title}
                sx={{
                  width: '80px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
            )}
            <Flex sx={{ flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <Text sx={{ fontFamily: 'title', fontSize: 3 }}>{project.title}</Text>
              <Flex sx={{ gap: 1, alignItems: 'center' }}>
                <Text sx={{ fontFamily: 'body', fontSize: 1, color: 'grey' }}>by</Text>
                {project.author && <Username user={project.author} />}
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Text sx={{ fontFamily: 'title', fontSize: 2 }}>Images</Text>
          {imagesError ? (
            <Text
              data-cy="remake-images-error"
              sx={{ fontFamily: 'body', fontSize: 2, color: 'red' }}
            >
              {imagesError}
            </Text>
          ) : (
            <Text sx={{ fontFamily: 'body', fontSize: 2, color: 'darkGrey' }}>
              You can upload up to {REMAKE_MAX_IMAGES} images.
            </Text>
          )}
          <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
            {images.map((image, index) => (
              <ImageInputFieldWrapper key={image.id} data-cy={`remake-image-${index}`}>
                <ImageInputV2
                  image={image}
                  deleteVariant="cornerIcon"
                  onFilesChange={(file) => {
                    if (!file) {
                      removeImage(index);
                    }
                  }}
                  onError={setImagesError}
                />
              </ImageInputFieldWrapper>
            ))}
            {images.length < REMAKE_MAX_IMAGES && (
              <ImageInputFieldWrapper data-cy="remake-image-upload">
                {isUploading ? (
                  <Spinner size={20} sx={{ color: 'darkGrey' }} />
                ) : (
                  <ImageInputV2
                    onFilesChange={(file) => handleImageSelect(file)}
                    onError={setImagesError}
                  />
                )}
              </ImageInputFieldWrapper>
            )}
          </Flex>
        </Flex>

        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Text sx={{ fontFamily: 'title', fontSize: 2 }}>Description</Text>
          <Text sx={{ fontFamily: 'body', fontSize: 2, color: 'darkGrey' }}>
            Tell people more about your challenges, changes you&apos;ve made and your learnings.
          </Text>
          <Textarea
            data-cy="remake-description-input"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={REMAKE_MAX_DESCRIPTION_LENGTH}
            placeholder="Tell more about your remake..."
            rows={6}
            sx={{
              backgroundColor: 'background',
              border: 'none',
              borderRadius: 1,
              fontFamily: 'body',
              fontSize: 3,
              lineHeight: 1.4,
              resize: 'vertical',
              flexShrink: 0,
              minHeight: '147px',
            }}
          />
          <Text sx={{ fontFamily: 'body', fontSize: 1, color: 'darkGrey', alignSelf: 'flex-end' }}>
            {description.length}/{REMAKE_MAX_DESCRIPTION_LENGTH}
          </Text>
        </Flex>

        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          <Button
            type="button"
            variant="primary"
            data-cy="remake-submit"
            disabled={isSubmitting || isUploading}
            onClick={handleSubmit}
            sx={{ justifyContent: 'center', height: '56px', fontSize: 4, borderRadius: 2 }}
          >
            {isEditing ? 'Save' : 'Publish'}
          </Button>
          <Button
            type="button"
            variant="outline"
            data-cy="remake-cancel"
            onClick={handleDismiss}
            sx={{ justifyContent: 'center' }}
          >
            Cancel
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              data-cy="remake-form-delete"
              disabled={isSubmitting}
              onClick={() => setShowDeleteConfirm(true)}
              sx={{ justifyContent: 'center' }}
            >
              Delete
            </Button>
          )}
        </Flex>

        {submitError && (
          <Box sx={{ flexShrink: 0 }}>
            <ErrorsContainer serverErrors={[submitError]} />
          </Box>
        )}
      </Flex>

      <ConfirmModal
        isOpen={showLeaveConfirm}
        message="You have unsaved changes. Are you sure you want to leave?"
        confirmButtonText="Yes"
        handleCancel={() => setShowLeaveConfirm(false)}
        handleConfirm={() => {
          setShowLeaveConfirm(false);
          onClose();
        }}
      />
      <ConfirmModal
        isOpen={showDeleteConfirm}
        message={REMAKE_DELETE_CONFIRM_MESSAGE}
        confirmButtonText="Delete"
        confirmVariant="destructive"
        handleCancel={() => setShowDeleteConfirm(false)}
        handleConfirm={handleDelete}
      />
      <UnsavedChangesDialog hasChanges={isDirty} />
    </Modal>
  );
};
