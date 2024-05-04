import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DownloadCounter,
  DownloadFileFromLink,
  DownloadStaticFile,
} from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Flex } from 'theme-ui'

import {
  addHowtoDownloadCooldown,
  isHowtoDownloadCooldownExpired,
  retrieveHowtoDownloadCooldown,
  updateHowtoDownloadCooldown,
} from './downloadCooldown'

import type { IHowtoDB, IUser } from 'src/models'

interface IProps {
  howto: IHowtoDB
  loggedInUser: IUser | undefined
}

export const HowtoDownloads = ({ howto, loggedInUser }: IProps) => {
  const { _id, files, fileLink, total_downloads } = howto
  const [fileDownloadCount, setFileDownloadCount] = useState(total_downloads)

  const navigate = useNavigate()
  const { howtoStore } = useCommonStores().stores

  const redirectToSignIn = async () => {
    navigate('/sign-in')
  }

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
      {fileLink && (
        <DownloadFileFromLink
          handleClick={handleDownloadClick}
          link={fileLink}
          redirectToSignIn={!loggedInUser ? redirectToSignIn : undefined}
        />
      )}
      {files &&
        files
          .filter(Boolean)
          .map(
            (file, index) =>
              file && (
                <DownloadStaticFile
                  allowDownload
                  file={file}
                  key={file ? file.name : `file-${index}`}
                  handleClick={handleDownloadClick}
                  redirectToSignIn={!loggedInUser ? redirectToSignIn : undefined}
                />
              ),
          )}
      <DownloadCounter total={fileDownloadCount} />
    </Flex>
  )
}
