import type { IConvertedFileMeta, IUploadedFileMeta } from 'oa-shared'

export type IInputValue = IUploadedFileMeta | IConvertedFileMeta
export type IFileMeta = IConvertedFileMeta | null
export type IMultipleInputValue = IInputValue[]
export type IValue = IInputValue | IMultipleInputValue
