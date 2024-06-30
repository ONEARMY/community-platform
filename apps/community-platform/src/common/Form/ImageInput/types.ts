import type { IConvertedFileMeta } from 'src/types'
import type { IUploadedFileMeta } from '../../../stores/storage'

export type IInputValue = IUploadedFileMeta | IConvertedFileMeta
export type IMultipleInputValue = IInputValue[]
export type IValue = IInputValue | IMultipleInputValue
