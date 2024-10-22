import { DownloadWithDonationAsk } from 'oa-components'

import type { IUploadedFileMeta } from 'oa-shared'

interface IProps {
  handleClick: () => Promise<void>
  isLoggedIn: boolean
  fileDownloadCount: number
  fileLink?: string
  files?: (IUploadedFileMeta | File | null)[]
}

export const DownloadWrapper = (props: IProps) => {
  const { handleClick, fileLink, isLoggedIn, files, fileDownloadCount } = props
  const hasFiles = files && files.length > 0

  if (!fileLink && !hasFiles) {
    return null
  }

  const body = import.meta.env.VITE_DONATIONS_BODY
  const iframeSrc = import.meta.env.VITE_DONATIONS_IFRAME_SRC
  const imageURL = import.meta.env.VITE_DONATIONS_IMAGE_URL

  return (
    <DownloadWithDonationAsk
      body={body}
      handleClick={handleClick}
      fileLink={fileLink}
      iframeSrc={iframeSrc}
      imageURL={imageURL}
      isLoggedIn={!!isLoggedIn}
      files={files}
      fileDownloadCount={fileDownloadCount}
    />
  )
}
