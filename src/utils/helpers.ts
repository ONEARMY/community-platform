const stripSpecialCharacters = (text: string) => {
  return text
    .replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '')
    .split(' ')
    .join('-')
}

export default { stripSpecialCharacters }
