import { downloadFileToTmp, IFileWriteMeta } from '../Utils/file.utils'
import { uploadLocalFileToStorage } from '../Utils/storage.utils'
import { firebaseAdmin } from '../Firebase/admin'
import { FIREBASE_CONFIG } from '../config/config'

const config = FIREBASE_CONFIG
const defaultBucket = firebaseAdmin.storage().bucket(config.storageBucket)

export const migrateAvatar = async (imgUrl: string, userId: string) => {
  const localImgMeta = (await downloadFileToTmp(imgUrl)) as IFileWriteMeta
  console.log('downloaded', localImgMeta)
  await uploadLocalFileToStorage(
    defaultBucket,
    localImgMeta.filePath,
    `avatars/${localImgMeta.filename}`,
    {},
  )
  console.log('file uploaded')
  return
}
