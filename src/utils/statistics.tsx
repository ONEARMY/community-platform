import { ProfileList } from 'oa-components';
import { usefulService } from 'src/services/usefulService';

import { buildStatisticsLabel } from './helpers';

import type { IStatistic } from 'oa-components';
import type { ContentType, ProfileListItem } from 'oa-shared';

export function createUsefulStatistic(
  contentType: ContentType,
  contentId: number,
  usefulCount: number,
): IStatistic {
  return {
    icon: 'star',
    count: usefulCount,
    label: buildStatisticsLabel({
      stat: usefulCount,
      statUnit: 'useful',
      usePlural: true,
    }),
    onOpen: async () => {
      try {
        return await usefulService.usefulVoters(contentType, contentId);
      } catch (error) {
        console.error('Failed to load useful voters:', error);
        return [];
      }
    },
    modalComponent: (profiles: ProfileListItem[]) => (
      <ProfileList header="Others that found it useful" profiles={profiles || []} />
    ),
  };
}
