import isUrl from 'is-url'
/****************************************************************************
 *            General Validation Methods
 * **************************************************************************/

const validateUrl = async (value: any) => {
  return value ? (isUrl(value) ? undefined : 'Invalid url') : 'Required'
}

/****************************************************************************
 *            FORM MUTATORS
 * **************************************************************************/

const addProtocol = ([name], state, { changeValue }) => {
  changeValue(state, name, (val: string) =>
    typeof val === 'string' && val.indexOf('://') === -1
      ? `http://${val}`
      : val,
  )
}

export { validateUrl, addProtocol }
