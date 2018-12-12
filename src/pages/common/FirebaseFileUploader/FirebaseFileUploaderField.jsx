import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FirebaseFileUploader } from './FirebaseFileUploader'

export const FirebaseFileUploaderField = ({ input, meta, ...rest }) => (
  <FirebaseFileUploader
    {...rest}
    onUploadSuccess={(fileInfo) => input.onChange(fileInfo.downloadUrl)}
  />
)

