import { insertImage$, usePublisher } from '@mdxeditor/editor';
import { useState } from 'react';
import { Box, Flex } from 'theme-ui';

import { Button } from '../Button/Button';
import { ImageInput } from '../ImageInput/ImageInput';
import type { IFileMeta } from '../ImageInput/types';
import { Loader } from '../Loader/Loader';
import { Modal } from '../Modal/Modal';

interface IProps {
  imageUploadHandler: (image: File) => Promise<string>;
}

export const AddImage = ({ imageUploadHandler }: IProps) => {
  const insertImage = usePublisher(insertImage$);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFilesChange = async (fileMeta: IFileMeta) => {
    setIsLoading(true);

    if (fileMeta) {
      const file = await imageUploadHandler(fileMeta.photoData);

      insertImage({
        src: file,
        altText: fileMeta.name,
        title: fileMeta.name,
      });
    }
    setIsLoading(false);
    setIsOpen(false);
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

      <Modal isOpen={isOpen} width={600}>
        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          {isLoading && <>Loading</>}
          <Box sx={{ height: '300px' }}>
            <ImageInput onFilesChange={onFilesChange} />
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
