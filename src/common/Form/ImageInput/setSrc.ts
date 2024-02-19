import type { IConvertedFileMeta } from 'src/types'
import type { IUploadedFileMeta } from '../../../stores/storage'
import type { IInputValue } from './ImageInput'

export const setSrc = (file: IInputValue): string => {
  if (!file) return ''

  const downloadFile = file as IUploadedFileMeta
  if (downloadFile.downloadUrl) {
    return downloadFile.downloadUrl
  }

  const photoFile = file as IConvertedFileMeta
  if (photoFile.photoData) {
    return URL.createObjectURL(photoFile.photoData)
  }

  return ''
}
