import { useState } from 'react'
import { DownloadWrapper } from 'src/common/DownloadWrapper'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Flex } from 'theme-ui'

import {
  addLibraryDownloadCooldown,
  isLibraryDownloadCooldownExpired,
  retrieveLibraryDownloadCooldown,
  updateLibraryDownloadCooldown,
} from '../utils/downloadCooldown'

import type { ILibrary, IUploadedFileMeta } from 'oa-shared'

interface IProps {
  item: ILibrary.DB
}

export const LibraryDownloads = ({ item }: IProps) => {
  const { _id, files, fileLink, total_downloads } = item
  const [fileDownloadCount, setFileDownloadCount] = useState(total_downloads)

  const { LibraryStore } = useCommonStores().stores

  const incrementDownloadCount = async () => {
    const updatedDownloadCount = await LibraryStore.incrementDownloadCount(_id)
    setFileDownloadCount(updatedDownloadCount!)
  }

  const handleDownloadClick = async () => {
    console.log(files)
    const howtoDownloadCooldown = retrieveLibraryDownloadCooldown(_id)

    if (
      howtoDownloadCooldown &&
      isLibraryDownloadCooldownExpired(howtoDownloadCooldown)
    ) {
      updateLibraryDownloadCooldown(_id)
      incrementDownloadCount()
    } else if (!howtoDownloadCooldown) {
      addLibraryDownloadCooldown(_id)
      incrementDownloadCount()
    }
  }

  if (files && files.length > 0 && fileLink) return null

  return (
    <Flex className="file-container" sx={{ mt: 3, flexDirection: 'column' }}>
      <DownloadWrapper
        handleClick={handleDownloadClick}
        fileLink={fileLink}
        files={(files as IUploadedFileMeta[])?.map((x) => ({
          id: x?.name,
          url: x.downloadUrl,
          size: x.size,
          name: x.name,
        }))}
        fileDownloadCount={fileDownloadCount || 0}
      />
    </Flex>
  )
}
