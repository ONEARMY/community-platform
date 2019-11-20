import isUrl from 'is-url'

/****************************************************************************
 *            General Validation Methods
 * **************************************************************************/

const validateUrl = async (value: any) => {
  console.log('val here')
  console.log('val ', value)
  return value ? (isUrl(value) ? undefined : 'Invalid url') : 'Required'
}

const addProtocol = (ev: any) => {
  const val = ev.target.value
  console.log('addprot ', val, ' ', ev.target.initialValue)
  ev.target.initialValue = val.indexOf('://') === -1 ? 'http://' + val : val
}

export { validateUrl, addProtocol }
