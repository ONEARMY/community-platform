import { trackEvent } from 'src/common/Analytics';
import { usefulService } from 'src/services/usefulService';

import type { Profile, UsefulContentType } from 'oa-shared';
import type { EventAction, EventCategory } from 'src/common/Analytics';

interface UsefulClickProps {
  vote: 'add' | 'delete';
  config: {
    loggedInUser: Profile | null | undefined;
    contentType: UsefulContentType;
    contentId: number;
    eventCategory: EventCategory;
    setVoted: (value: boolean | ((prev: boolean) => boolean)) => void;
    setUsefulCount: (value: number | ((prev: number) => number)) => void;
    label?: string;
    slug?: string;
    checkResponse?: boolean;
  };
}
const onUsefulClick = async (props: UsefulClickProps) => {
  const { vote, config } = props;
  const {
    loggedInUser,
    contentType,
    contentId,
    eventCategory,
    label,
    slug,
    setVoted,
    setUsefulCount,
  } = config;

  if (!loggedInUser?.username) {
    return;
  }

  // Trigger update without waiting
  if (vote === 'add') {
    await usefulService.add(contentType, contentId);
  } else {
    await usefulService.remove(contentType, contentId);
  }

  setVoted((prev) => !prev);

  setUsefulCount((prev) => {
    return vote === 'add' ? prev + 1 : prev - 1;
  });

  trackEvent({
    category: eventCategory,
    action: (vote === 'add'
      ? `${capitalize(contentType)}Useful`
      : `${capitalize(contentType)}UsefulRemoved`) as EventAction,
    label: label || slug || `${contentType}-${contentId}`,
  });
};

export { onUsefulClick };

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
