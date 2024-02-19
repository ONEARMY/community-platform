import type { IConvertedFileMeta } from 'src/types'
import type { IUploadedFileMeta } from '../../../stores/storage'
import type { IInputValue } from './ImageInput'

export const setSrc = (file: IInputValue): string => {
  const downloadFile = file as IUploadedFileMeta
  const photoFile = file as IConvertedFileMeta

  if (file === undefined) return ''

  if (downloadFile.downloadUrl) {
    return downloadFile.downloadUrl
  }
  if (photoFile.photoData) {
    return URL.createObjectURL(photoFile.photoData)
  }
  return ''
}
