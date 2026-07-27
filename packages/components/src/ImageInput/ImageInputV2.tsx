import { MediaWithPublicUrl } from 'oa-shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Flex, Image as ImageComponent } from 'theme-ui';
import { Button } from '../Button/Button';
import { ImageInputDeleteOverlay } from './ImageInputDeleteOverlay';
import { isImageValid } from './isImageValid';

interface IProps {
  onFilesChange: (fileMeta: File | undefined) => void;
  onError?: (error: string) => void;
  image?: MediaWithPublicUrl;
  maxFileSize?: number;
}

const ACCEPTED_FORMATS = '.jpeg,.jpg,.png,.gif,.svg,.webp';
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ImageInputV2 = (props: IProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onFilesChange, onError, image, maxFileSize = DEFAULT_MAX_FILE_SIZE } = props;
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image?.publicUrl;
  }, [file, image]);

  // Cleanup object URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(URL.createObjectURL(file));
      }
    };
  }, [file]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    // Reset input to allow selecting the same file again if needed
    event.target.value = '';

    // Check file size
    if (selectedFile.size > maxFileSize) {
      const sizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
      const errorMsg = `Image is too large. Maximum size is ${sizeMB}MB.`;
      onError?.(errorMsg);
      return;
    }

    // Validate image format and integrity
    try {
      await isImageValid(selectedFile);
      setFile(selectedFile);
      onFilesChange(selectedFile);
    } catch {
      const errorMsg =
        'Invalid image file. Please upload a valid image (jpeg, jpg, png, gif, svg, or webp).';
      onError?.(errorMsg);
    }
  };

  const handleImageDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setFile(null);
    onFilesChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleWrapperClick = () => {
    fileInputRef.current?.click();
  };

  const hasImage = !!(file || image);

  return (
    <Flex
      className="image-input__wrapper"
      onClick={handleWrapperClick}
      sx={{
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderColor: 'background',
        borderStyle: hasImage ? 'none' : 'solid',
        borderRadius: 1,
        borderWidth: '2px',
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        cursor: 'pointer',
      }}
    >
      <input
        ref={fileInputRef}
        data-testid="image-input"
        type="file"
        accept={ACCEPTED_FORMATS}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {previewUrl && (
        <ImageComponent
          src={previewUrl}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {!hasImage ? (
        <Button small variant="outline" icon="image" type="button">
          Upload
        </Button>
      ) : (
        <ImageInputDeleteOverlay onClick={handleImageDelete} />
      )}
    </Flex>
  );
};
