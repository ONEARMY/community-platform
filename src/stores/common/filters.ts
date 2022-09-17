export const convertUserReferenceToPlainText = (str: string = '') => {
  if (!str) return str

  return str.replace(/@@\{([\w]+)\:([\w]+)\}/gi, '@$2')
}
