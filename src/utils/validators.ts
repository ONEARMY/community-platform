import isUrl from 'is-url'
/****************************************************************************
 *            General Validation Methods
 * **************************************************************************/

const validateUrl = async (value: any) => {
  console.log('val here')
  console.log('val ', value)
  return value ? (isUrl(value) ? undefined : 'Invalid url') : 'Required'
}

/****************************************************************************
 *            FORM MUTATORS
 * **************************************************************************/

const addProtocol = (args, state, { changeValue }) => {
  console.log('s ', state)
  console.log('n ', name)
  // val.indexOf('://') === -1 ? `http://${val}` : val
  changeValue(state, 'hi', () => 'mm')
}

export { validateUrl, addProtocol }
