import type { TransformOptions } from '@supabase/storage-js'

export const IMAGE_SIZES: { [key: string]: TransformOptions } = {
  LANDSCAPE: {
    width: 1280,
    resize: 'contain',
  },
  GALLERY: {
    width: 956,
    resize: 'contain',
  },
  LIST: {
    width: 478,
    resize: 'contain',
  },
}
