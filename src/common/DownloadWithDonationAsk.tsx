import { useState } from 'react'
import { useNavigate } from '@remix-run/react'
import {
  DonationRequestModal,
  DownloadButton,
  DownloadCounter,
  DownloadStaticFile,
} from 'oa-components'

import type { IUploadedFileMeta } from 'oa-shared'

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
  const { handleClick, fileDownloadCount, fileLink, files, isLoggedIn } = props
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [link, setLink] = useState<string>('')
  const navigate = useNavigate()

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
        body={import.meta.env.VITE_DONATIONS_BODY}
        callback={callback}
        iframeSrc={import.meta.env.VITE_DONATIONS_IFRAME_SRC}
        imageURL={import.meta.env.VITE_DONATIONS_IMAGE_URL}
        isOpen={isModalOpen}
        link={link}
        onDidDismiss={() => toggleIsModalOpen()}
      />

      {!isLoggedIn && (
        <DownloadButton
          onClick={() => navigate('/sign-in')}
          isLoggedIn={false}
        />
      )}
      {isLoggedIn && (
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
      )}
      <DownloadCounter total={fileDownloadCount} />
    </>
  )
}
