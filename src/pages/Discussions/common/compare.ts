export const compareDate = (a: any, b: any) =>
  new Date(a.seconds) < new Date(b.seconds) === true ? 1 : -1
