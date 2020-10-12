import {
  getStorageFileMeta,
  uploadLocalFileToStorage,
} from '../../Firebase/storage'
import { resizeLocalImage } from '../../Utils/image.utils'
import { downloadFileToTemp, IFileWriteMeta } from '../../Utils/file.utils'

export const migrateAvatar = async (imgUrl: string, userId: string) => {
  // download
  const localImgMeta = (await downloadFileToTemp(imgUrl)) as IFileWriteMeta
  // convert and upload
  // note, will operate sequentially on the same file
  const avatar = await resizeLocalImage(localImgMeta.filePath, 'avatar', 'jpg')
  await uploadLocalFileToStorage(avatar, `avatars/${userId}.jpg`, {})
  const thumb = await resizeLocalImage(localImgMeta.filePath, 'thumb', 'jpg')
  await uploadLocalFileToStorage(thumb, `avatars/${userId}.thumb.jpg`, {})
  // get meta and return
  const avatarMeta = await getStorageFileMeta(`avatars/${userId}.jpg`)
  const thumbMeta = await getStorageFileMeta(`avatars/${userId}.thumb.jpg`)
  return { avatar: avatarMeta, thumb: thumbMeta }
}
