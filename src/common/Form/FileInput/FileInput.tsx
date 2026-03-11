import { Button } from 'oa-components';
import { useRef, useState } from 'react';
import { Flex, Text } from 'theme-ui';
import { FileDisplay } from './FileDisplay';

const MaxFileSize = {
  user: 50 * 1048576,
  admin: 300 * 1048576,
};

interface IProps {
  onFilesChange?: (files: (Blob | File)[]) => void;
  'data-cy'?: string;
  admin: boolean;
}

type FileWithId = File & { id: string };

export const FileInput = (props: IProps) => {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = props.admin ? MaxFileSize.admin : MaxFileSize.user;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = Array.from(event.target.files || []);

    // Check number of files
    if (files.length + selectedFiles.length > 5) {
      setError(`You can only upload up to 5 files`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = selectedFiles.filter((file) => file.size > maxFileSize);

    if (oversizedFiles.length > 0) {
      const maxSizeMB = Math.floor(maxFileSize / 1048576);
      setError(`Some files exceed the maximum size of ${maxSizeMB}MB`);
      return;
    }

    // Add unique IDs to files
    const newFiles = selectedFiles.map((file) =>
      Object.assign(file, { id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}` }),
    ) as FileWithId[];

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    props.onFilesChange?.(updatedFiles);

    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const remove = (id: string) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    setFiles(updatedFiles);
    props.onFilesChange?.(updatedFiles);
  };

  return (
    <Flex sx={{ flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input"
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        icon="upload"
        variant="outline"
        sx={{ mb: 1, width: 'fit-content ' }}
        data-cy={props['data-cy']}
      >
        Add Files
      </Button>

      {error && <Text sx={{ color: 'error', fontSize: 1, mb: 1 }}>{error}</Text>}

      {files.map((file) => (
        <FileDisplay
          key={file.id}
          file={{
            id: file.id,
            name: file.name,
            size: file.size ?? 0,
          }}
          onRemove={() => remove(file.id)}
        />
      ))}
    </Flex>
  );
};
