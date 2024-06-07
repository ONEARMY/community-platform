import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DonationRequestModal,
  DownloadButton,
  DownloadFileFromLink,
} from 'oa-components'

import { useCommonStores } from './hooks/useCommonStores'
import { AuthWrapper } from './AuthWrapper'

import type { UserRole } from 'src/models'

export interface IProps {
  handleClick: () => Promise<void>
  isLoggedIn: boolean
  link: string
}

/*
  An edited version of the oa-component DownloadFileFromLink.
  Once the donation ask is on all download links, some of this logic
  can/should move to the component library.
*/
export const DownloadWithDonationAsk = (props: IProps) => {
  const { handleClick, isLoggedIn, link } = props
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const { themeStore } = useCommonStores().stores

  const toggleIsModalOpen = () => setIsModalOpen(!isModalOpen)

  const callback = () => {
    handleClick()
    toggleIsModalOpen()
  }

  if (!isLoggedIn) {
    return (
      <DownloadButton
        onClick={async () => navigate('/sign-in')}
        isLoggedIn={false}
      />
    )
  }

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
          <DownloadFileFromLink handleClick={handleClick} link={link} />
        }
      >
        <DownloadButton onClick={toggleIsModalOpen} isLoggedIn />
      </AuthWrapper>
    </>
  )
}
