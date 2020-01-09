export enum Page {
  HOME_PAGE = '/how-to',
  ACADEMY = '/academy',
  EVENTS = '/events',
  SETTINGS = '/settings',
}

export const generatedId = (length: number) => {
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
  v3_users = 'v3_users',
}
