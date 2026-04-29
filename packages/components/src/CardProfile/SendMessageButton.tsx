import type { MapPin } from 'oa-shared';
import { Button } from '../Button/Button';
import { InternalLink } from '../InternalLink/InternalLink';

interface IProps {
  item: MapPin;
}

export const SendMessageButton = ({ item }: IProps) => {
  const isContactable = (item.profile?.isContactable ?? true) && item.profile?.username;
  return isContactable ? (
    <InternalLink
      sx={{ alignSelf: 'flex-end' }}
      to={`/u/${item.profile?.username}#contact`}
      data-cy="PinProfileMessageLink"
      target="_blank"
    >
      <Button icon="contact" small>
        Send Message
      </Button>
    </InternalLink>
  ) : null;
};
