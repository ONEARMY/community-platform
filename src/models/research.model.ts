import type {
  IConvertedFileMeta,
  Image,
  MediaFile,
  ResearchStatus,
} from 'oa-shared'
import type { SelectValue } from 'src/pages/common/Category/CategoriesSelectV2'

export type ResearchFormData = {
  title: string
  description: string
  category?: SelectValue
  tags?: number[]
  collaborators?: string[]
  status: ResearchStatus
  image?: IConvertedFileMeta
  existingImage: Image | null
}

export type ResearchUpdateFormData = {
  title: string
  description: string
  images?: File[]
  existingImages: Image[] | null
  files?: File[]
  existingFiles?: MediaFile[] | null
  fileLink?: string
  videoUrl?: string
}
