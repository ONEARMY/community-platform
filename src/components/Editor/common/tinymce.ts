import { TinyMCEUrl } from '../config'

declare var tinymce
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
const addScript = (relativeUrl: string) => {
  const script = document.createElement('script')
  script.src = relativeUrl
  script.async = true

  const promise = new Promise((resolve, reject) => {
    script.addEventListener('load', () => setTimeout(resolve, 0))
    script.addEventListener('error', e => reject(e))
  }).catch(e => {
    throw e
  })
  document.body.appendChild(script)

  return promise
}

export const load = async () =>
  isLoaded() ? Promise.resolve() : addScript(TinyMCEUrl())

export const isLoaded = () => typeof tinymce !== 'undefined'
