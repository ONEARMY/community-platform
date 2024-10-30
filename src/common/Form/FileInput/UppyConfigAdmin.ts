import type { UppyOptions } from '@uppy/core'

export const UPPY_CONFIG_ADMIN: Partial<UppyOptions> = {
  restrictions: {
    // max upload file size in bytes (i.e. 300 x 1048576 => 300 MB)
    maxFileSize: 300 * 1048576,
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
      exceedsSize: 'This file exceeds maximum allowed size of %{size}',
      youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
      companionError: 'Connection with Companion failed',
    },
  },
}
