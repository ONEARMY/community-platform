import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DonationRequestModal,
  DownloadButton,
  DownloadCounter,
  DownloadFileFromLink,
  DownloadStaticFile,
} from '@onearmy.apps/components'

import { useCommonStores } from './hooks/useCommonStores'
import { AuthWrapper } from './AuthWrapper'

import type { UserRole } from '../models'
import type { IUploadedFileMeta } from '../stores/storage'

export interface IProps {
  handleClick: () => Promise<void>
  isLoggedIn: boolean
  fileDownloadCount: number
  fileLink: string | undefined
  files: (IUploadedFileMeta | File | null)[] | undefined
}

/*
  An edited version of the oa-component DownloadFileFromLink.
  Once the donation ask is on all download links, some of this logic
  can/should move to the component library.
*/
export const DownloadWithDonationAsk = (props: IProps) => {
  const { handleClick, isLoggedIn, fileDownloadCount, fileLink, files } = props
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [link, setLink] = useState<string>('')
  const navigate = useNavigate()
  const { themeStore } = useCommonStores().stores

  const toggleIsModalOpen = () => setIsModalOpen(!isModalOpen)

  const callback = () => {
    handleClick()
    toggleIsModalOpen()
  }

  const filteredFiles: IUploadedFileMeta[] | undefined = files?.filter(
    (file): file is IUploadedFileMeta => file !== null && 'downloadUrl' in file,
  )

  return (
    <>
      <DonationRequestModal
        body={themeStore?.currentTheme.donations?.body}
        callback={callback}
        iframeSrc={themeStore?.currentTheme.donations?.iframeSrc}
        imageURL={themeStore?.currentTheme.donations?.imageURL}
        isOpen={isModalOpen}
        link={link}
        onDidDismiss={() => toggleIsModalOpen()}
      />

      <AuthWrapper
        roleRequired={'beta-tester' as UserRole}
        fallback={
          <>
            {!isLoggedIn && (
              <DownloadButton
                onClick={async () => navigate('/sign-in')}
                isLoggedIn={false}
              />
            )}

            {isLoggedIn && fileLink && (
              <DownloadFileFromLink handleClick={handleClick} link={fileLink} />
            )}
            {isLoggedIn &&
              filteredFiles &&
              filteredFiles.map((file, index) => (
                <DownloadStaticFile
                  allowDownload
                  file={file}
                  key={file ? file.name : `file-${index}`}
                  handleClick={handleClick}
                  isLoggedIn
                />
              ))}
          </>
        }
      >
        <>
          {fileLink && (
            <DownloadButton
              onClick={() => {
                setLink(fileLink)
                toggleIsModalOpen()
              }}
              isLoggedIn
            />
          )}
          {filteredFiles &&
            filteredFiles.map((file, index) => (
              <DownloadStaticFile
                file={file}
                key={file ? file.name : `file-${index}`}
                handleClick={() => {
                  setLink(file.downloadUrl)
                  toggleIsModalOpen()
                }}
                forDonationRequest
                isLoggedIn
              />
            ))}
        </>
      </AuthWrapper>
      <DownloadCounter total={fileDownloadCount} />
    </>
  )
}
