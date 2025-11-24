import { DonationRequest } from '../DonationRequest/DonationRequest';
import { Modal } from '../Modal/Modal';

export interface IProps {
  body: string | undefined;
  imageURL: string | undefined;
  iframeSrc: string | undefined;
  isOpen: boolean;
  onDidDismiss: () => void;
  children?: React.ReactNode | React.ReactNode[];
}

export const DonationRequestModal = (props: IProps) => {
  const { body, iframeSrc, imageURL, isOpen, onDidDismiss, children } = props;

  return (
    <Modal
      onDidDismiss={onDidDismiss}
      isOpen={isOpen}
      sx={{
        width: ['500px', '750px', '1050px'],
        minWidth: '350px',
        border: '0 !important',
        background: 'none !important',
      }}
    >
      <DonationRequest body={body} iframeSrc={iframeSrc} imageURL={imageURL} />
      {children}
    </Modal>
  );
};
