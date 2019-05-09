import React from 'react'
import { FirebaseFileUploader } from '../FirebaseFileUploader/FirebaseFileUploader'

export const FirebaseFileUploaderField = ({ input, meta, ...rest }) => (
  <FirebaseFileUploader
    {...rest}
    onUploadSuccess={fileInfo => input.onChange(fileInfo)}
  />
)
