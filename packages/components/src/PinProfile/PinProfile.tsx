import type { MapPin } from 'oa-shared';
import { Box } from 'theme-ui';
import { Button } from '../Button/Button';
import { CardButton } from '../CardButton/CardButton';
import { CardProfile } from '../CardProfile/CardProfile';
import { InternalLink } from '../InternalLink/InternalLink';

export interface IProps {
  item: MapPin;
}

export const PinProfile = ({ item }: IProps) => {
  const sendMessageButton = (
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
  );

  return (
    <CardButton
      extrastyles={{ '&:hover': {}, '&:active': {}, width: '325px' }}
      data-cy="PinProfile"
    >
      <Box sx={{ width: '100%', height: '100%', zIndex: 2 }}>
        <CardProfile item={item} isLink sendMessageButton={sendMessageButton} />
      </Box>
    </CardButton>
  );
};
