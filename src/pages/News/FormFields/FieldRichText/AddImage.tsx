import type { Editor } from '@tiptap/react';
import { ImageIcon } from 'lucide-react';
import { Button, ImageInputV2, Loader, Modal } from 'oa-components';
import type { MediaWithPublicUrl } from 'oa-shared';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from 'src/components/ui/tooltip';
import { Box, Flex } from 'theme-ui';

interface IProps {
  editor: Editor;
  imageUploadHandler: (image: File) => Promise<MediaWithPublicUrl | null>;
}

export const AddImage = ({ editor, imageUploadHandler }: IProps) => {
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
        editor.chain().focus().setImage({ src: mediaFile.publicUrl }).run();
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

  const close = () => {
    setIsOpen(false);
    setError(null);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              small
              variant="subtle"
              type="button"
              aria-label="Insert image"
              onClick={() => setIsOpen(true)}
            />
          }
        >
          <ImageIcon size={16} />
        </TooltipTrigger>
        <TooltipContent>Insert image</TooltipContent>
      </Tooltip>

      <Modal isOpen={isOpen} width={600} onDismiss={close}>
        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          {error && <Box sx={{ color: 'error', fontSize: 1 }}>{error}</Box>}
          <Box sx={{ height: '300px' }}>
            <ImageInputV2 onFilesChange={onFilesChange} onError={handleError} />
          </Box>
          <Flex>
            {isLoading ? (
              <Loader />
            ) : (
              <Button variant="secondary" type="button" onClick={close}>
                Cancel
              </Button>
            )}
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
