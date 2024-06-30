import type { IUploadedFileMeta } from '../../../stores/storage'
import type { IConvertedFileMeta } from '../../../types'

export type IInputValue = IUploadedFileMeta | IConvertedFileMeta
export type IMultipleInputValue = IInputValue[]
export type IValue = IInputValue | IMultipleInputValue
