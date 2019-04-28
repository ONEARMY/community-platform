import {
  getStorageFileMeta,
  uploadLocalFileToStorage,
} from '../Firebase/storage'
import { resizeLocalImage } from '../Utils/image.utils'
import { downloadFileToTemp, IFileWriteMeta } from '../Utils/file.utils'

export const migrateAvatar = async (imgUrl: string, userId: string) => {
  // download
  const localImgMeta = (await downloadFileToTemp(imgUrl)) as IFileWriteMeta
  // convert
  const avatar = await resizeLocalImage(localImgMeta.filePath, 'avatar', 'jpg')
  const thumb = await resizeLocalImage(localImgMeta.filePath, 'thumb', 'jpg')
  // upload
  await uploadLocalFileToStorage(avatar, `avatars/${userId}.jpg`, {})
  await uploadLocalFileToStorage(thumb, `avatars/${userId}.thumb.jpg`, {})
  console.log('file uploaded')
  const avatarMeta = await getStorageFileMeta(`avatars/${userId}.jpg`)
  const thumbMeta = await getStorageFileMeta(`avatars/${userId}.jpg`)
  return { avatar: avatarMeta, thumb: thumbMeta }
}
