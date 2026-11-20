import type { MapPin } from 'oa-shared';
import { Link } from 'react-router';
import { Button } from '../Button/Button';

interface IProps {
  item: MapPin;
}

export const SendMessageButton = ({ item }: IProps) => {
  const isContactable = (item.profile?.isContactable ?? true) && item.profile?.username;
  return isContactable ? (
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
  ) : null;
};
