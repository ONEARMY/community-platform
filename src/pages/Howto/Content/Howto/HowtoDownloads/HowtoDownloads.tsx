import { useState } from 'react'
import { DownloadWrapper } from 'src/common/DownloadWrapper'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Flex } from 'theme-ui'

import {
  addHowtoDownloadCooldown,
  isHowtoDownloadCooldownExpired,
  retrieveHowtoDownloadCooldown,
  updateHowtoDownloadCooldown,
} from './downloadCooldown'

import type { IHowtoDB, IUser } from 'oa-shared'

interface IProps {
  howto: IHowtoDB
  loggedInUser: IUser | undefined
}

export const HowtoDownloads = ({ howto, loggedInUser }: IProps) => {
  const { _id, files, fileLink, total_downloads } = howto
  const [fileDownloadCount, setFileDownloadCount] = useState(total_downloads)

  const { howtoStore } = useCommonStores().stores

  const incrementDownloadCount = async () => {
    const updatedDownloadCount = await howtoStore.incrementDownloadCount(_id)
    setFileDownloadCount(updatedDownloadCount!)
  }

  const handleDownloadClick = async () => {
    const howtoDownloadCooldown = retrieveHowtoDownloadCooldown(_id)

    if (
      howtoDownloadCooldown &&
      isHowtoDownloadCooldownExpired(howtoDownloadCooldown)
    ) {
      updateHowtoDownloadCooldown(_id)
      incrementDownloadCount()
    } else if (!howtoDownloadCooldown) {
      addHowtoDownloadCooldown(_id)
      incrementDownloadCount()
    }
  }

  if (howto.files && howto.files.length > 0 && howto.fileLink) return null

  return (
    <Flex className="file-container" mt={3} sx={{ flexDirection: 'column' }}>
      <DownloadWrapper
        handleClick={handleDownloadClick}
        fileLink={fileLink}
        files={files}
        isLoggedIn={!!loggedInUser}
        fileDownloadCount={fileDownloadCount || 0}
      />
    </Flex>
  )
}
