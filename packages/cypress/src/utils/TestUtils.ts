export enum Page {
  HOWTO = '/how-to',
  ACADEMY = '/academy',
  SETTINGS = '/settings',
}

export const generateAlphaNumeric = (length: number) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export enum DbCollectionName {
  users = 'users',
  howtos = 'howtos',
}

export const generateNewUserDetails = () => {
  return {
    username: `CI_${generateAlphaNumeric(5)}`.toLocaleLowerCase(),
    email: `CI_${generateAlphaNumeric(5)}@test.com`.toLocaleLowerCase(),
    password: 'test1234',
  }
}

export const setIsPreciousPlastic = () => {
  return localStorage.setItem('platformTheme', 'precious-plastic')
}
