import { DonationRequest } from '../DonationRequest/DonationRequest'
import { Modal } from '../Modal/Modal'

export interface IProps {
  body: string
  callback: () => void
  imageURL: string
  iframeSrc: string
  isOpen: boolean
  link: string
  onDidDismiss: () => void
}

export const DonationRequestModal = (props: IProps) => {
  const { body, callback, iframeSrc, imageURL, isOpen, link, onDidDismiss } =
    props

  const sx = {
    // There's some reinventing of the response wheel here...
    minWidth: ['90%', '90%', '750px', '1050px'],
    border: '0 !important',
    padding: '0 !important',
    width: 'inherit',
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
