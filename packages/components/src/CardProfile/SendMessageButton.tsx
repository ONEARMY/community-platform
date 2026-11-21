import type { MapPin } from 'oa-shared';
import { Link } from 'react-router';
import { Button } from '../Button/Button';

interface IProps {
  item: MapPin;
  onSendMessage?: (item: MapPin) => void;
}

export const SendMessageButton = ({ item, onSendMessage }: IProps) => {
  const isContactable = (item.profile?.isContactable ?? true) && item.profile?.username;
  return isContactable ? (
    onSendMessage ? (
      <Button
        className="self-end"
        icon="contact"
        small
        onClick={() => onSendMessage(item)}
        data-cy="PinProfileMessageButton"
      >
        Send Message
      </Button>
    ) : (
      <Link
        className="self-end"
        to={`/u/${item.profile?.username}#contact`}
        data-cy="PinProfileMessageLink"
        target="_blank"
      >
        <Button icon="contact" small>
          Send Message
        </Button>
      </Link>
    )
  ) : null;
};
