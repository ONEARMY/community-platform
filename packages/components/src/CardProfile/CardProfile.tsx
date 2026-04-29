import type { MapPin } from 'oa-shared';
import { Flex } from 'theme-ui';
import { CardDetailsMemberProfile } from './CardDetailsMemberProfile';
import { CardDetailsSpaceProfile } from './CardDetailsSpaceProfile';

export type CardVariant = 'pin' | 'list';

export interface IProps {
  cardVariant?: CardVariant;
  item: MapPin;
  isLink?: boolean;
  sendMessageButton?: React.ReactNode;
}

export const CardProfile = ({
  cardVariant = 'pin',
  item,
  isLink = false,
  sendMessageButton,
}: IProps) => {
  const isWorkspace = item.profile?.type && item.profile?.type.isSpace;
  const isContactable = item.profile?.isContactable !== false && item.profile?.username;
  const messageButton = isContactable ? sendMessageButton : undefined;

  return (
    <Flex sx={{ alignItems: 'stretch', alignContent: 'stretch' }}>
      {isWorkspace ? (
        <CardDetailsSpaceProfile item={item} isLink={isLink} sendMessageButton={messageButton} />
      ) : (
        <CardDetailsMemberProfile
          item={item}
          isLink={isLink}
          cardVariant={cardVariant}
          sendMessageButton={messageButton}
        />
      )}
    </Flex>
  );
};
