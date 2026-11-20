import type { MapPin } from 'oa-shared';
import { Link } from 'react-router';
import { Box } from 'theme-ui';
import { CardButton } from '../CardButton/CardButton';
import { CardProfile } from '../CardProfile/CardProfile';

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
  };

  if (viewport === 'mobile') {
    return (
      <Link
        target="_blank"
        to={item.profile?.username ? `/u/${item.profile.username}` : '/settings/profile'}
        {...wrapperProps}
        className="rounded-md py-2"
      >
        {Card}
      </Link>
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
