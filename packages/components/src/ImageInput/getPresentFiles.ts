/**
 * As input can be both array or single object and either uploaded or converted meta,
 * require extra function to separate out to handle preview of previously uploaded
 */

import type { IConvertedFileMeta, IUploadedFileMeta } from 'oa-shared';
import type { IMultipleInputValue, IValue } from './types';

type Value = IValue | undefined;

export const getPresentFiles = (value: Value): IMultipleInputValue => {
  if (!value) return [];

  const valArray = Array.isArray(value) ? value : [value];

  return valArray.filter((value) => {
    if (Object.prototype.hasOwnProperty.call(value, 'downloadUrl')) {
      return value as IUploadedFileMeta;
    }
    if (Object.prototype.hasOwnProperty.call(value, 'objectUrl')) {
      return value as IConvertedFileMeta;
    }
  });
};
