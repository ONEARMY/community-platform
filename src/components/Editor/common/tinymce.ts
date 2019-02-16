export interface IImageData {
  src: string
  alt: string
  title: string
  width: string
  height: string
  class: string
  style: string
  caption: boolean
  hspace: string
  vspace: string
  border: string
  borderStyle: string
}
export const toImageData = (src: string, extra = {}): IImageData => {
  return {
    src,
    alt: '',
    title: '',
    width: '',
    height: '',
    class: '',
    style: '',
    caption: false,
    hspace: '',
    vspace: '',
    border: '',
    borderStyle: '',
    ...extra,
  }
}
