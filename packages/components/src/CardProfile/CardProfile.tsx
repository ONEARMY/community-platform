import type { MapPin } from 'oa-shared';
import { Flex } from 'theme-ui';
import { CardDetailsMemberProfile } from './CardDetailsMemberProfile';
import { CardDetailsSpaceProfile } from './CardDetailsSpaceProfile';

export type CardVariant = 'pin' | 'list';

export interface IProps {
  variant?: CardVariant;
  item: MapPin;
  isLink?: boolean;
}

export const CardProfile = ({ variant = 'pin', item, isLink = false }: IProps) => {
  const isWorkspace = item.profile?.type && item.profile?.type.isSpace;

  return (
    <Flex sx={{ alignItems: 'stretch', alignContent: 'stretch' }}>
      {isWorkspace ? (
        <CardDetailsSpaceProfile item={item} isLink={isLink} variant={variant} />
      ) : (
        <CardDetailsMemberProfile item={item} isLink={isLink} variant={variant} />
      )}
    </Flex>
  );
};
