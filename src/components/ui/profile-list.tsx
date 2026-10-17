import { MemberBadge } from 'oa-components';
import type { ProfileListItem } from 'oa-shared';
import { useRef } from 'react';
import { Avatar, AvatarImage } from './avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Username } from './username';

type ProfileListProps = {
  profiles: ProfileListItem[];
  header: string;
  onClose?: () => void;
};

function ProfileList({ profiles, header, onClose }: ProfileListProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent
        data-cy="profile-list-modal"
        variant="strong"
        initialFocus={popupRef}
        ref={popupRef}
      >
        <DialogHeader variant="strong">
          <DialogTitle>{header}</DialogTitle>
        </DialogHeader>
        {profiles.length === 0 ? (
          <p className="px-4 py-3 text-center text-xs text-muted-foreground">No users yet.</p>
        ) : (
          <ul className="flex max-h-96 flex-col gap-4 overflow-y-auto px-4 py-3">
            {profiles.map((profile) => (
              <li key={profile.id} className="flex items-center gap-2">
                {profile.photo ? (
                  <Avatar>
                    <AvatarImage
                      src={profile.photo.publicUrl}
                      alt={profile.displayName}
                      loading="lazy"
                    />
                  </Avatar>
                ) : (
                  <MemberBadge profileType={profile.type || undefined} />
                )}
                <Username user={profile} />
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { ProfileList };
