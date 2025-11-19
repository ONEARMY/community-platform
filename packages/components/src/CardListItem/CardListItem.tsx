import { Box } from 'theme-ui';

import { CardButton } from '../CardButton/CardButton';
import { CardProfile } from '../CardProfile/CardProfile';
import { InternalLink } from '../InternalLink/InternalLink';

import type { MapPin } from 'oa-shared';

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
    <CardButton isSelected={isSelectedPin}>
      <CardProfile item={item} />
    </CardButton>
  );

  const wrapperProps = {
    'data-cy': testProp,
    'data-testid': testProp,
    sx: {
      borderRadius: 2,
      padding: 2,
    },
  };

  if (viewport === 'mobile') {
    return (
      <InternalLink target="_blank" to={`/u/${item.profile!.username}`} {...wrapperProps}>
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
        padding: 2,
      }}
    >
      {Card}
    </Box>
  );
};
