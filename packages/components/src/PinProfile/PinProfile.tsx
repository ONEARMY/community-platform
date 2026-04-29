import type { MapPin } from 'oa-shared';
import { Box } from 'theme-ui';
import { CardButton } from '../CardButton/CardButton';
import { CardProfile } from '../CardProfile/CardProfile';

export interface IProps {
  item: MapPin;
}

export const PinProfile = ({ item }: IProps) => {
  return (
    <CardButton
      extrastyles={{ '&:hover': {}, '&:active': {}, width: '325px' }}
      data-cy="PinProfile"
    >
      <Box sx={{ width: '100%', height: '100%', zIndex: 2 }}>
        <CardProfile item={item} isLink />
      </Box>
    </CardButton>
  );
};
