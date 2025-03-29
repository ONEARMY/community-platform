import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DownloadButton, DownloadWithDonationAsk } from 'oa-components'

import { UserAction } from './UserAction'

import type { IUploadedFileMeta } from 'oa-shared'

interface IProps {
  handleClick: () => Promise<void>
  fileDownloadCount: number
  fileLink?: string
  files?: (IUploadedFileMeta | File | null)[]
}

export const DownloadWrapper = (props: IProps) => {
  const { handleClick, fileLink, files, fileDownloadCount } = props
  const [openModel, setOpenModel] = useState<boolean>(false)
  const hasFiles = files && files.length > 0
  const navigate = useNavigate()

  if (!fileLink && !hasFiles) {
    return null
  }

  useEffect(() => {
    if (sessionStorage.getItem('loginRedirect') && (fileLink || hasFiles)) {
      sessionStorage.removeItem('loginRedirect')
      if (files && files?.length === 1) {
        setOpenModel(true)
      }
    }
  }, [fileLink, hasFiles])

  const handleLoggedOutDownloadClick = () => {
    sessionStorage.setItem('loginRedirect', 'true')
    navigate(
      `/sign-in?returnUrl=${encodeURIComponent(`${location?.pathname}`)}`,
    )
  }

  const body = import.meta.env.VITE_DONATIONS_BODY
  const iframeSrc = import.meta.env.VITE_DONATIONS_IFRAME_SRC
  const imageURL = import.meta.env.VITE_DONATIONS_IMAGE_URL

  return (
    <UserAction
      loggedIn={
        <DownloadWithDonationAsk
          body={body}
          handleClick={handleClick}
          fileLink={fileLink}
          iframeSrc={iframeSrc}
          imageURL={imageURL}
          files={files}
          fileDownloadCount={fileDownloadCount}
          openModel={openModel}
        />
      }
      loggedOut={
        <DownloadButton
          isLoggedIn={false}
          fileDownloadCount={fileDownloadCount}
          onClick={handleLoggedOutDownloadClick}
        />
      }
    />
  )
}
