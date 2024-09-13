import { DonationRequest } from '../DonationRequest/DonationRequest'
import { Modal } from '../Modal/Modal'

export interface IProps {
  body: string | undefined
  callback: () => void
  imageURL: string | undefined
  iframeSrc: string | undefined
  isOpen: boolean
  link: string
  onDidDismiss: () => void
}

export const DonationRequestModal = (props: IProps) => {
  const { body, callback, iframeSrc, imageURL, isOpen, link, onDidDismiss } =
    props

  const sx = {
    width: ['500px', '750px', '1050px'],
    minWidth: '350px',
    border: '0 !important',
    background: 'none !important',
  }

  return (
    <Modal onDidDismiss={onDidDismiss} isOpen={isOpen} sx={sx}>
      <DonationRequest
        body={body}
        callback={callback}
        iframeSrc={iframeSrc}
        link={link}
        imageURL={imageURL}
      />
    </Modal>
  )
}
