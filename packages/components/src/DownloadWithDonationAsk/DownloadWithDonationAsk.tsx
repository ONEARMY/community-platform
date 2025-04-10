import { useState } from 'react'

import { DonationRequestModal } from '../DonationRequestModal/DonationRequestModal'
import { DownloadButton } from '../DownloadButton/DownloadButton'
import { DownloadStaticFile } from '../DownloadStaticFile/DownloadStaticFile'

import type { MediaFile } from 'oa-shared'

export interface IProps {
  body: string
  handleClick: () => Promise<void>
  iframeSrc: string
  imageURL: string
  fileDownloadCount: number
  fileLink?: string
  files?: MediaFile[]
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

  const toggleIsModalOpen = () => setIsModalOpen(!isModalOpen)

  const callback = () => {
    handleClick()
    toggleIsModalOpen()
  }

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
        {files &&
          files.map((file, index) => (
            <DownloadStaticFile
              file={file}
              key={file ? file.url : `file-${index}`}
              handleClick={() => {
                setLink(file.url!)
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
