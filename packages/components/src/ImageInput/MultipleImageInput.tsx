import { MediaWithPublicUrl } from 'oa-shared';
import { useRef } from 'react';
import { Box, Flex, Image as ImageComponent, Spinner, Text } from 'theme-ui';
import { Icon } from '../Icon/Icon';
import { ImageInputDeleteOverlay } from './ImageInputDeleteOverlay';
import { isImageValid } from './isImageValid';

interface IProps {
  images: MediaWithPublicUrl[];
  maxImages: number;
  buttonLabel: string;
  isUploading?: boolean;
  onFilesSelect: (files: File[]) => void;
  onDelete: (index: number) => void;
  onError?: (error: string) => void;
}

const ACCEPTED_FORMATS = '.jpeg,.jpg,.png,.gif,.svg,.webp';
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const MultipleImageInput = (props: IProps) => {
  const { images, maxImages, buttonLabel, isUploading, onFilesSelect, onDelete, onError } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    // Reset input to allow selecting the same file again if needed
    event.target.value = '';

    if (selectedFiles.length === 0) {
      return;
    }

    const remaining = maxImages - images.length;
    if (selectedFiles.length > remaining) {
      onError?.(`You can upload at most ${maxImages} pictures.`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of selectedFiles) {
      if (file.size > DEFAULT_MAX_FILE_SIZE) {
        const sizeMB = (DEFAULT_MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
        onError?.(`Image is too large. Maximum size is ${sizeMB}MB.`);
        return;
      }

      try {
        await isImageValid(file);
        validFiles.push(file);
      } catch {
        onError?.(
          'Invalid image file. Please upload a valid image (jpeg, jpg, png, gif, svg, or webp).',
        );
        return;
      }
    }

    onFilesSelect(validFiles);
  };

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <input
        ref={fileInputRef}
        data-testid="multiple-image-input"
        type="file"
        accept={ACCEPTED_FORMATS}
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {images.length > 0 && (
        <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
          {images.map((image, index) => (
            <Box
              key={image.id || index}
              className="image-input__wrapper"
              data-testid="multiple-image-input-thumbnail"
              sx={{
                position: 'relative',
                width: '130px',
                height: '90px',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <ImageComponent
                src={image.publicUrl}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <ImageInputDeleteOverlay
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(index);
                }}
              />
            </Box>
          ))}
        </Flex>
      )}

      {images.length < maxImages && (
        <Flex
          onClick={() => !isUploading && fileInputRef.current?.click()}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            padding: 3,
            borderRadius: 1,
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'softblue',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          {isUploading ? (
            <Spinner size={20} />
          ) : (
            <>
              <Icon glyph="image" />
              <Text sx={{ fontSize: 1 }}>{buttonLabel}</Text>
            </>
          )}
        </Flex>
      )}
    </Flex>
  );
};
