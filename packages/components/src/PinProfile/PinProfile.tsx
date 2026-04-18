import type { MapPin } from 'oa-shared';
import { Box, Flex } from 'theme-ui';
import { Button } from '../Button/Button';
import { CardButton } from '../CardButton/CardButton';
import { CardProfile } from '../CardProfile/CardProfile';
import { InternalLink } from '../InternalLink/InternalLink';

export interface IProps {
  item: MapPin;
}

export const PinProfile = ({ item }: IProps) => {
  const isContactable = item.profile?.isContactable !== false && item.profile?.username;

  return (
    <CardButton
      extrastyles={{ '&:hover': {}, '&:active': {}, width: '325px' }}
      data-cy="PinProfile"
    >
      <Box sx={{ width: '100%', height: '100%', zIndex: 2 }}>
        <CardProfile item={item} isLink />

        {isContactable && (
          <Flex sx={{ justifyContent: 'flex-end', pr: 3, pb: 3 }}>
            <InternalLink
              to={`/u/${item.profile?.username}#contact`}
              data-cy="PinProfileMessageLink"
              target="_blank"
            >
              <Button icon="contact" small>
                Send Message
              </Button>
            </InternalLink>
          </Flex>
        )}
      </Box>
    </CardButton>
  );
};
