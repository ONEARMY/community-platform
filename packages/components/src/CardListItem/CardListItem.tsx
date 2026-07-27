import type { MapPin } from 'oa-shared';
import { Box } from 'theme-ui';
import { CardButton } from '../CardButton/CardButton';
import { CardProfile } from '../CardProfile/CardProfile';
import { InternalLink } from '../InternalLink/InternalLink';

export interface IProps {
  item: MapPin;
  isSelectedPin: boolean;
  onPinClick: (arg: MapPin) => void;
  viewport: string;
}

export const CardListItem = (props: IProps) => {
  const { item, onPinClick, isSelectedPin, viewport } = props;
  const testProp = `CardListItem${isSelectedPin ? '-selected' : ''}`;

  const Card = (
    <CardButton
      isSelected={isSelectedPin}
      extrastyles={{ minWidth: '250px', maxWidth: '500px', mx: 'auto' }}
    >
      <CardProfile item={item} variant="list" />
    </CardButton>
  );

  const wrapperProps = {
    'data-cy': testProp,
    'data-testid': testProp,
    sx: {
      borderRadius: 2,
      paddingY: 2,
      paddingX: 0,
    },
  };

  if (viewport === 'mobile') {
    return (
      <InternalLink
        target="_blank"
        to={item.profile?.username ? `/u/${item.profile.username}` : '/settings/profile'}
        {...wrapperProps}
      >
        {Card}
      </InternalLink>
    );
  }

  return (
    <Box
      data-cy={testProp}
      data-testid={testProp}
      onClick={() => onPinClick(item)}
      sx={{
        borderRadius: 2,
        paddingY: 2,
        paddingX: 0,
      }}
    >
      {Card}
    </Box>
  );
};
