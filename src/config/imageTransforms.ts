export type ImageSize = {
  height: number
  width: number
}

export const IMAGE_SIZES: { [key: string]: ImageSize } = {
  LANDSCAPE: {
    width: 1280,
    height: 960,
  },
  GALLERY: {
    width: 956,
    height: 450,
  },
  LIST: {
    width: 478,
    height: 225,
  },
}
