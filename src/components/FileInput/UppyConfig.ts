import Uppy from '@uppy/core'

export const UPPY_CONFIG: Partial<Uppy.UppyOptions> = {
  restrictions: {
    maxFileSize: 5000000,
    maxNumberOfFiles: 5,
    minNumberOfFiles: null,
    allowedFileTypes: null,
  },
  locale: {
    strings: {
      youCanOnlyUploadX: {
        0: 'You can only upload %{smart_count} file',
        1: 'You can only upload %{smart_count} files',
      },
      youHaveToAtLeastSelectX: {
        0: 'You have to select at least %{smart_count} file',
        1: 'You have to select at least %{smart_count} files',
      },
      exceedsSize: 'This file exceeds maximum allowed size of',
      youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
      companionError: 'Connection with Companion failed',
    },
  },
}
