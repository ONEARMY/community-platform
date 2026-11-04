import type { MapPin } from 'oa-shared';
import { Flex } from 'theme-ui';
import { CardDetailsMemberProfile } from './CardDetailsMemberProfile';
import { CardDetailsSpaceProfile } from './CardDetailsSpaceProfile';

export type CardVariant = 'pin' | 'list';

export interface IProps {
  variant?: CardVariant;
  item: MapPin;
  isLink?: boolean;
  onSendMessage?: (item: MapPin) => void;
}

export const CardProfile = ({ variant = 'pin', item, isLink = false, onSendMessage }: IProps) => {
  const isWorkspace = item.profile?.type && item.profile?.type.isSpace;

  return (
    <Flex sx={{ alignItems: 'stretch', alignContent: 'stretch' }}>
      {isWorkspace ? (
        <CardDetailsSpaceProfile
          item={item}
          isLink={isLink}
          variant={variant}
          onSendMessage={onSendMessage}
        />
      ) : (
        <CardDetailsMemberProfile
          item={item}
          isLink={isLink}
          variant={variant}
          onSendMessage={onSendMessage}
        />
      )}
    </Flex>
  );
};
