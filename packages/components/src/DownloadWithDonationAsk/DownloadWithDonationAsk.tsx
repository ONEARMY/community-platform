import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DonationRequestModal } from '../DonationRequestModal/DonationRequestModal'
import { DownloadButton } from '../DownloadButton/DownloadButton'
import { DownloadCounter } from '../DownloadCounter/DownloadCounter'
import { DownloadStaticFile } from '../DownloadStaticFile/DownloadStaticFile'

import type { IUploadedFileMeta } from 'oa-shared'

export interface IProps {
  handleClick: () => Promise<void>
  isLoggedIn: boolean
  fileDownloadCount: number
  fileLink?: string
  files?: (IUploadedFileMeta | File | null)[]
}

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
