import React from 'react'
import { FirebaseFileUploader } from './FirebaseFileUploader'

export const FirebaseFileUploaderField = ({ input, meta, ...rest }) => (
  <FirebaseFileUploader
    {...rest}
    onUploadSuccess={fileInfo => input.onChange(fileInfo)}
  />
)
