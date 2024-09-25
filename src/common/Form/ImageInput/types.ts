import type { IConvertedFileMeta, IUploadedFileMeta } from 'oa-shared'

export type IInputValue = IUploadedFileMeta | IConvertedFileMeta
export type IMultipleInputValue = IInputValue[]
export type IValue = IInputValue | IMultipleInputValue
