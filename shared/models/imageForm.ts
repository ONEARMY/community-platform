import type { IConvertedFileMeta } from './common'
import type { Image } from './media'

export interface IImageForm {
  image?: IConvertedFileMeta
  existingImage: Image | null
}
