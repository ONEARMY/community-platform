import type {
  IConvertedFileMeta,
  Image,
  MediaFile,
  ResearchStatus,
  SelectValue,
} from 'oa-shared'

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
