import { Flex } from 'theme-ui';

import { CardDetailsMemberProfile } from './CardDetailsMemberProfile';
import { CardDetailsSpaceProfile } from './CardDetailsSpaceProfile';

import type { MapPin } from 'oa-shared';

export interface IProps {
  item: MapPin;
  isLink?: boolean;
}

export const CardProfile = ({ item, isLink = false }: IProps) => {
  const { profile } = item;

  const isWorkspace = profile?.type && profile?.type.isSpace;

  return (
    <Flex sx={{ alignItems: 'stretch', alignContent: 'stretch' }}>
      {isWorkspace ? (
        <CardDetailsSpaceProfile profile={profile} isLink={isLink} />
      ) : (
        <CardDetailsMemberProfile profile={profile} isLink={isLink} />
      )}
    </Flex>
  );
};
