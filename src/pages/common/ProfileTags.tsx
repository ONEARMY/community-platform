import { ProfileTagsList } from 'oa-components';

import type { Profile, ProfileTag } from 'oa-shared';

export type ShowVisitorModal = () => void;

interface IProps {
  tags: ProfileTag[] | undefined;
  visitorPolicy?: Profile['visitorPolicy'];
  isSpace: boolean;
  showVisitorModal: ShowVisitorModal;
}

export const ProfileTags = (props: IProps) => {
  const { tags, visitorPolicy, isSpace, showVisitorModal } = props;

  return (
    <ProfileTagsList
      tags={tags || null}
      visitorPolicy={visitorPolicy}
      isSpace={isSpace}
      showVisitorModal={showVisitorModal}
      large={true}
    />
  );
};
