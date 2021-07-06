import { join } from 'path'
import sharp from 'sharp'
import { tmpdir } from 'os'
import { ensureDir } from 'fs-extra'

// These are the widths used when compressing images to different sizes
export enum STANDARD_WIDTHS {
  thumb = 160,
  avatar = 320,
  low = 640,
  med = 1280,
  high = 1920,
}

// take a file at a local location and resize, return location of new file
// optionally can rename file 'size@...' prefix. same name does not overwrite local file
export const resizeLocalImage = async (
  filePath: string,
  size: keyof typeof STANDARD_WIDTHS,
  extension?: 'jpg' | 'png',
  rename?: boolean,
) => {
  const width = STANDARD_WIDTHS[size]
  let fileName = filePath.split('/').pop()
  const ext = fileName.split('.').pop()
  // optionally change extension
  if (extension && ext !== extension) {
    fileName = fileName.replace(`.${ext}`, `.${extension}`)
  }
  // prepare output
  const resizedFileName = rename ? `size@${size}_${fileName}` : fileName
  await ensureDir(join(tmpdir(), 'resized'))
  const resizedFilePath = join(tmpdir(), 'resized', resizedFileName)
  console.log(`resizing [${filePath}]`)
  // Resize source image
  await sharp(filePath)
    .resize(width)
    .toFile(resizedFilePath)
  return resizedFilePath
}

export const getImageDimensions = async (filePath: string) => {
  const meta = await sharp(filePath).metadata()
  return { width: meta.width, height: meta.height }
}

// const resizeStorageImage = async obj => {
//   const { name, contentType, bucketName } = obj
//   if (!contentType.startsWith('image/')) {
//     console.log('This is not an image.')
//     return null
//   }
// }
