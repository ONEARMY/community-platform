export type ImageSize = {
  height: number
  width: number
}

export const IMAGE_SIZES: { [key: string]: ImageSize } = {
  GALLERY: {
    height: 450,
    width: 956,
  },
  LIST: {
    height: 225,
    width: 478,
  },
}
