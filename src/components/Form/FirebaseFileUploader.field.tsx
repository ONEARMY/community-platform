import { FirebaseFileUploader } from '../FirebaseFileUploader/FirebaseFileUploader'

export const FirebaseFileUploaderField = ({ input, ...rest }) => (
  <FirebaseFileUploader
    {...rest}
    onUploadSuccess={fileInfo => input.onChange(fileInfo)}
  />
)
