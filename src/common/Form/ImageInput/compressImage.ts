import Compressor from 'compressorjs'

export const compressImage = (image: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!image) {
      reject()
      return
    }

    new Compressor(image, {
      quality: 0.6, // 0 to 1
      success: (compressed) => {
        resolve(compressed as File)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}
