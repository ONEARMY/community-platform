import type { IStatistic } from 'oa-components';
import { ProfileList } from 'oa-components';
import type { ContentType, ProfileListItem } from 'oa-shared';
import { usefulService } from 'src/services/usefulService';
import { buildStatisticsLabel } from './helpers';

export function createUsefulStatistic(
  contentType: ContentType,
  contentId: number,
  usefulCount: number,
  includeVotersList: boolean = false,
): IStatistic {
  return {
    icon: 'star',
    stat: usefulCount,
    label: buildStatisticsLabel({
      stat: usefulCount,
      statUnit: 'useful',
      usePlural: false,
    }),
    ...(includeVotersList && {
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
    }),
  };
}
