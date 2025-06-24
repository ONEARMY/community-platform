import { useState } from 'react'
import { Flex } from 'theme-ui'

import { DonationRequestModal } from '../DonationRequestModal/DonationRequestModal'
import { DownloadButton } from '../DownloadButton/DownloadButton'
import { DownloadStaticFile } from '../DownloadStaticFile/DownloadStaticFile'

import type { MediaFile } from 'oa-shared'

export interface IProps {
  body: string
  handleClick?: () => Promise<void>
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
    fileLink,
    files,
    openModel = false,
  } = props
  const [isModalOpen, setIsModalOpen] = useState<boolean>(openModel)
  const [link, setLink] = useState<string>('')

  const toggleIsModalOpen = () => setIsModalOpen(!isModalOpen)

  const callback = () => {
    toggleIsModalOpen()
    if (handleClick) {
      handleClick()
    }
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
            isLoggedIn
            fileDownloadCount={props.fileDownloadCount}
            onClick={() => {
              setLink(fileLink)
              toggleIsModalOpen()
            }}
          />
        )}
        {files && (
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            {files.map((file, index) => (
              <DownloadStaticFile
                file={file}
                key={file ? file.url : `file-${index}`}
                fileDownloadCount={props.fileDownloadCount}
                handleClick={() => {
                  setLink(file.url!)
                  toggleIsModalOpen()
                }}
                isLoggedIn
              />
            ))}
          </Flex>
        )}
      </>
    </>
  )
}
