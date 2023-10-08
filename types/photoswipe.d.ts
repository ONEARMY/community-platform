declare module 'photoswipe/lightbox' {
  import PhotoSwipeLightbox, {
    PhotoSwipeOptions,
    // eslint-disable-next-line import/no-unresolved
  } from 'photoswipe/dist/types/lightbox/lightbox'

  export { PhotoSwipeOptions }
  // eslint-disable-next-line import/no-default-export
  export default PhotoSwipeLightbox
}
