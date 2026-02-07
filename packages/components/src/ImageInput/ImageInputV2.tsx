import type { Image } from 'oa-shared';
import { useMemo, useRef, useState } from 'react';
import Dropzone from 'react-dropzone-esm';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Box, Flex, Image as ImageComponent, Text } from 'theme-ui';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import { ImageInputDeleteImage } from './ImageInputDeleteImage';
import { ImageInputWrapper } from './ImageInputWrapper';
import { imageValid } from './imageValid';

interface IProps {
  onFilesChange: (fileMeta: File | undefined) => void;
  imageDisplaySx?: ThemeUIStyleObject | undefined;
  existingImage?: Image;
}

export const ImageInputV2 = (props: IProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { imageDisplaySx, onFilesChange, existingImage } = props;

  const [file, setFile] = useState<File | null>(null);
  const [isImageCorrupt, setIsImageCorrupt] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const src = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
  }, [file]);

  const onDrop = async (selectedImage: File[]) => {
    try {
      await imageValid(selectedImage[0]);
      setIsImageCorrupt(false);

      setFile(selectedImage[0]);
      onFilesChange(selectedImage[0]);
    } catch (_) {
      setIsImageCorrupt(true);
      setShowErrorModal(true);
    }
  };

  const handleImageDelete = (event: Event) => {
    event.stopPropagation();
    setFile(null);
    onFilesChange(undefined);
  };

  return (
    <Box p={0} sx={imageDisplaySx ? imageDisplaySx : { height: '100%' }}>
      <Dropzone
        accept={{
          'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.svg', '.webp'],
        }}
        multiple={false}
        onDrop={onDrop}
      >
        {({ getRootProps, getInputProps, rootRef }) => (
          <ImageInputWrapper {...getRootProps()} ref={rootRef} hasUploadedImg={!!existingImage}>
            <input ref={fileInputRef} data-testid={'image-input'} {...getInputProps()} />

            {src ? (
              <ImageComponent src={src} sx={imageDisplaySx} />
            ) : (
              <ImageComponent src={existingImage?.publicUrl} sx={imageDisplaySx} />
            )}

            {!src && !existingImage ? (
              <Button small variant="outline" icon="image" type="button">
                Upload
              </Button>
            ) : (
              <ImageInputDeleteImage onClick={(event) => handleImageDelete(event)} />
            )}
          </ImageInputWrapper>
        )}
      </Dropzone>
      <Modal width={600} isOpen={showErrorModal} onDidDismiss={() => setShowErrorModal(false)}>
        {isImageCorrupt && (
          <Flex
            data-cy="ImageUploadError"
            mt={[1, 1, 1]}
            sx={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <Text>The uploaded image appears to be corrupted or a type we don't accept.</Text>
            <Text>
              Check your image is valid and one of the following formats: jpeg, jpg, png, gif, heic,
              svg or webp.
            </Text>
            <Button
              data-cy="ImageUploadError-Button"
              sx={{ marginTop: '20px', justifyContent: 'center' }}
              onClick={() => setShowErrorModal(false)}
            >
              Try uploading something else
            </Button>
          </Flex>
        )}
      </Modal>
    </Box>
  );
};
