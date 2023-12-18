import { useEffect, useState } from 'react'
import { Image } from 'theme-ui'

import DefaultMemberImage from 'src/assets/images/default_member.svg'
import { useCommonStores } from 'src/index'

import type { IUploadedFileMeta } from 'src/stores/storage'

interface IProps {
  userName: string
}

export const UserAvatar = ({ userName }: IProps) => {
  const [src, setSrc] = useState<string>(DefaultMemberImage)
  const { userStore } = useCommonStores().stores

  useEffect(() => {
    const getUrl = async () => {
      const user = await userStore.getUserByUsername(userName)

      if (user && user.coverImages && user.coverImages.length >= 0) {
        if ((user.coverImages[0] as IUploadedFileMeta).downloadUrl) {
          setSrc((user.coverImages[0] as IUploadedFileMeta).downloadUrl)
        }
      }
    }
    getUrl()
  }, [])

  return (
    <Image
      loading="lazy"
      src={src}
      sx={{
        objectFit: 'cover',
        height: '50px',
        margin: 1,
        width: '50px',
        minWidth: '50px',
        borderRadius: '25px',
      }}
    />
  )
}
