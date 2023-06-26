import { commonColors } from './colors'
import { commonFontFamily } from './fontFamily'

const _commonInputStyle = {
  borderRadius: 1,
  '&:focus': {
    borderColor: commonColors.blue,
    outline: 'none',
    boxShadow: 'none',
  },
}

export const commonForms = {
  input: {
    background: commonColors.background,
    border: '1px solid transparent',
    fontFamily: commonFontFamily.body,
    fontSize: 1,
    ..._commonInputStyle,
  },
  inputOutline: {
    background: 'white',
    border: `2px solid ${commonColors.black}`,
    ..._commonInputStyle,
  },
  error: {
    background: commonColors.background,
    border: `1px solid ${commonColors.error}`,
    fontFamily: commonFontFamily.body,
    fontSize: 1,
    ..._commonInputStyle,
  },
  textarea: {
    background: commonColors.background,
    border: `1px solid transparent`,
    fontFamily: commonFontFamily.body,
    fontSize: 1,
    padding: 2,
    ..._commonInputStyle,
  },
  textareaError: {
    background: commonColors.background,
    border: `1px solid ${commonColors.error}`,
    fontFamily: commonFontFamily.body,
    fontSize: 1,
    padding: 2,
    ..._commonInputStyle,
  },
}
