import { observer } from 'mobx-react';
import type { OptionalFollowButtonProps } from 'oa-components';
import { FollowButton } from 'oa-components';
import type { SubscribableContentTypes } from 'oa-shared';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { subscribersService } from 'src/services/subscribersService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { trackEvent } from './Analytics';

interface IProps extends OptionalFollowButtonProps {
  contentType: SubscribableContentTypes;
  itemId: number;
  setSubscribersCount?: Dispatch<SetStateAction<number>>;
  hideSubscribeIcon?: boolean;
  tooltipContent?: string;
  showIconOnly?: boolean;
}

export const FollowButtonAction = observer((props: IProps) => {
  const { contentType, hideSubscribeIcon, itemId, setSubscribersCount, showIconOnly } = props;
  const [subscribed, setSubscribed] = useState<boolean | undefined>(undefined);
  const { profile } = useProfileStore();

  useEffect(() => {
    const getSubscribed = async () => {
      const subscribed = await subscribersService.isSubscribed(contentType, itemId);
      setSubscribed(subscribed);
    };

    if (profile) {
      getSubscribed();
    }
  }, [profile, itemId]);

  const onFollowClick = async () => {
    if (!profile || showIconOnly) {
      return;
    }

    if (!subscribed) {
      const response = await subscribersService.add(contentType, itemId);

      if (response.ok) {
        setSubscribed(true);
        setSubscribersCount && setSubscribersCount((prev: number) => prev + 1 || 1);
      }
    } else {
      const response = await subscribersService.remove(contentType, itemId);

      if (response.ok) {
        setSubscribed(false);
        setSubscribersCount && setSubscribersCount((prev) => prev - 1 || 0);
      }
    }

    trackEvent({
      category: contentType,
      action: subscribed ? 'unsubscribed' : 'subscribed',
      label: `${itemId}`,
    });
  };

  if (!subscribed && hideSubscribeIcon) {
    return;
  }

  if (subscribed === undefined) {
    return;
  }

  return (
    <FollowButton
      {...props}
      hasUserSubscribed={subscribed}
      isLoggedIn={!!profile}
      onFollowClick={onFollowClick}
    />
  );
});
