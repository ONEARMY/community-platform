import type { ICategory } from './categories'
import type { IConvertedFileMeta } from './common'
import type { DBDoc } from './db'
import type { IModerable } from './moderation'
import type { IUploadedFileMeta } from './storage'
import type { ISelectedTags } from './tags'
import type { UserMention } from './user'
import type { ISharedFeatures } from './voteUseful'

export enum DifficultyLevel {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  VERY_HARD = 'Very Hard',
}

export declare namespace ILibrary {
  type DB = ILibrary.Item & DBDoc

  interface FormInput extends IModerable, ISharedFeatures {
    slug: string
    title: string
    allowDraftSave?: boolean
    category?: ICategory

    // NOTE cover image input starts as convertedFileMeta but is transformed on upload
    cover_image?: IUploadedFileMeta | IConvertedFileMeta
    cover_image_alt?: string

    // Added to be able to recover on edit by admin
    creatorCountry?: string
    totalComments?: number
    latestCommentDate?: string
    description?: string
    difficulty_level?: DifficultyLevel
    files?: Array<IUploadedFileMeta | File | null>
    fileLink?: string
    mentions?: UserMention[]
    steps: StepInput[]

    // note, tags will remain optional as if populated {} will be stripped by db (firestore)
    tags?: ISelectedTags
    time?: string
  }

  interface Item extends FormInput {
    _createdBy: string
    _deleted: boolean
    cover_image?: IUploadedFileMeta
    cover_image_alt?: string
    fileLink?: string
    total_downloads?: number
    latestCommentDate?: string | undefined
    mentions: UserMention[]
    previousSlugs: string[]
    totalComments: number
    totalUsefulVotes?: number
    keywords?: string[]
  }

  interface StepInput {
    images?: Array<IUploadedFileMeta | IConvertedFileMeta | null>
    title?: string
    text?: string
    videoUrl?: string
    _animationKey?: string
  }

  interface Step extends StepInput {
    images?: Array<IUploadedFileMeta | null>
    videoUrl?: string
    title?: string
    text?: string

    // *** NOTE - adding an '_animationKey' field to track when specific array element removed for
    _animationKey?: string
  }
}
