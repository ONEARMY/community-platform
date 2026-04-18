import type { MapPin } from 'oa-shared';
import { Flex } from 'theme-ui';
import { CardDetailsMemberProfile } from './CardDetailsMemberProfile';
import { CardDetailsSpaceProfile } from './CardDetailsSpaceProfile';

export interface IProps {
  item: MapPin;
  isLink?: boolean;
  variant?: 'pin' | 'list';
}

export const CardProfile = ({ item, isLink = false, variant }: IProps) => {
  const { profile } = item;

  const isWorkspace = profile?.type && profile?.type.isSpace;

  return (
    <Flex sx={{ alignItems: 'stretch', alignContent: 'stretch' }}>
      {isWorkspace ? (
        <CardDetailsSpaceProfile profile={profile} isLink={isLink} />
      ) : (
        <CardDetailsMemberProfile profile={profile} isLink={isLink} variant={variant} />
      )}
    </Flex>
  );
};
