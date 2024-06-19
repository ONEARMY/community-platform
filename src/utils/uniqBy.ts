export const uniqBy = <T>(array: T[], key: keyof T) => {
  return array.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t[key] === item[key]),
  )
}
