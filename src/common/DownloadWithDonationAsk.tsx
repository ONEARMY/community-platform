import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DonationRequestModal,
  DownloadButton,
  DownloadFileFromLink,
} from 'oa-components'

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
        body="All of the content here is free. Your donation supports this library of Open Source recycling knowledge. Making it possible for everyone in the world to use it and start recycling."
        callback={callback}
        iframeSrc="https://donorbox.org/embed/ppcpdonor?language=en"
        imageURL="https://images.unsplash.com/photo-1520222984843-df35ebc0f24d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9"
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
