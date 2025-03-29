import { useEffect, useState } from 'react'

import { DonationRequestModal } from '../DonationRequestModal/DonationRequestModal'
import { DownloadButton } from '../DownloadButton/DownloadButton'
import { DownloadStaticFile } from '../DownloadStaticFile/DownloadStaticFile'

import type { IUploadedFileMeta } from 'oa-shared'

export interface IProps {
  body: string
  handleClick: () => Promise<void>
  iframeSrc: string
  imageURL: string
  fileDownloadCount: number
  fileLink?: string
  files?: (IUploadedFileMeta | File | null)[]
  openModel?: boolean
}

export const DownloadWithDonationAsk = (props: IProps) => {
  const {
    body,
    iframeSrc,
    imageURL,
    handleClick,
    fileDownloadCount,
    fileLink,
    files,
    openModel = false,
  } = props
  const [isModalOpen, setIsModalOpen] = useState<boolean>(openModel)
  const [link, setLink] = useState<string>('')

  // Add effect to set initial link when modal opens automatically
  useEffect(() => {
    if (openModel && fileLink) {
      setLink(fileLink)
    }
  }, [openModel])

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
        body={body}
        callback={callback}
        iframeSrc={iframeSrc}
        imageURL={imageURL}
        isOpen={isModalOpen}
        link={link}
        onDidDismiss={() => toggleIsModalOpen()}
      />
      <>
        {fileLink && (
          <DownloadButton
            fileDownloadCount={fileDownloadCount}
            isLoggedIn
            onClick={() => {
              setLink(fileLink)
              toggleIsModalOpen()
            }}
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
              fileDownloadCount={fileDownloadCount}
              isLoggedIn
            />
          ))}
      </>
    </>
  )
}
