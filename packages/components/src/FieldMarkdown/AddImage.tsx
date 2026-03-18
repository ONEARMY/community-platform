import { insertImage$, usePublisher } from '@mdxeditor/editor';
import { MediaWithPublicUrl } from 'oa-shared';
import { useState } from 'react';
import { Box, Flex } from 'theme-ui';
import { Button } from '../Button/Button';
import { ImageInputV2 } from '../ImageInput/ImageInputV2';
import { Loader } from '../Loader/Loader';
import { Modal } from '../Modal/Modal';

interface IProps {
  imageUploadHandler: (image: File) => Promise<MediaWithPublicUrl | null>;
}

export const AddImage = ({ imageUploadHandler }: IProps) => {
  const insertImage = usePublisher(insertImage$);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFilesChange = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const mediaFile = await imageUploadHandler(file);

      if (mediaFile) {
        insertImage({
          src: mediaFile.publicUrl,
        });
      } else {
        setError('Failed to upload image. Please try again.');
      }

      setIsOpen(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <>
      <Button
        small
        variant="subtle"
        icon="image"
        type="button"
        showIconOnly
        onClick={() => setIsOpen(true)}
      >
        Upload
      </Button>

      <Modal isOpen={isOpen} width={600} onDismiss={() => {}}>
        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          {error && <Box sx={{ color: 'error', fontSize: 1 }}>{error}</Box>}
          <Box sx={{ height: '300px' }}>
            <ImageInputV2 onFilesChange={onFilesChange} onError={handleError} />
          </Box>
          <Flex>
            {isLoading ? (
              <Loader />
            ) : (
              <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            )}
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
