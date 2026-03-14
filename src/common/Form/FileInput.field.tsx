import { FileInput } from './FileInput/FileInput';

import type { FieldProps } from './types';

export const FileInputField = ({
  input,
  onFilesChange,
  ...rest
}: FieldProps & { admin: boolean; onFilesChange?: (files: (Blob | File)[]) => void }) => (
  <FileInput
    {...rest}
    onFilesChange={(files) => {
      if (onFilesChange) {
        // If custom handler provided, use it instead
        onFilesChange(files);
      } else {
        // Default behavior - update form field directly
        input.onChange(files);
        input.onBlur();
      }
    }}
  />
);
