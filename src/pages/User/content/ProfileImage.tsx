import { ImageGallery } from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery'
import { AspectRatio, Box, Flex } from 'theme-ui'

import type { IUser } from 'oa-shared'

interface IProps {
  user: IUser
}

export const ProfileImage = ({ user }: IProps) => {
  const { profileType } = user

  if (profileType === ProfileTypeList.MEMBER) {
    return null
  }

  const getCoverImages = (user: IUser) => {
    if (user.coverImages && user.coverImages.length) {
      return user.coverImages
    }

    return []
  }

  const coverImage = getCoverImages(user)

  return (
    <Box>
      {coverImage.length ? (
        <ImageGallery
          images={formatImagesForGallery(coverImage) as any}
          hideThumbnails={true}
          showNextPrevButton={true}
        />
      ) : (
        <AspectRatio ratio={24 / 3}>
          <Flex
            sx={{
              width: '100%',
              height: '100%',
              background: '#ddd',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            No images available.
          </Flex>
        </AspectRatio>
      )}
    </Box>
  )
}
