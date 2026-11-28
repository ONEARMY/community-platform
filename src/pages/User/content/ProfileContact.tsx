import type { Profile } from 'oa-shared';
import { UserAction } from 'src/common/UserAction';
import { isUserContactable } from 'src/utils/helpers';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SendIcon from '@/components/ui/icons/send.svg?react';
import { UserContactFormAvailable, UserContactNotLoggedIn } from '../contact';
import { UserContactForm } from '../contact/UserContactForm';

interface IProps {
  user: Profile;
  isViewingOwnProfile: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileContact = ({ user, isViewingOwnProfile, open, onOpenChange }: IProps) => {
  const isContactable = isUserContactable(user);

  return (
    <div data-cy="UserContactWrapper" className="flex flex-col">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger
          render={
            <Button
              data-cy="SendMessageButton"
              aria-disabled={isViewingOwnProfile && !isContactable}
            />
          }
        >
          <SendIcon data-icon="inline-start" aria-hidden="true" />
          Send message
        </DialogTrigger>
        <DialogContent variant="soft" className="sm:max-w-lg">
          {isViewingOwnProfile ? (
            <>
              <DialogHeader>
                <DialogTitle>Messages</DialogTitle>
              </DialogHeader>
              <UserContactFormAvailable isUserProfileContactable={isContactable} />
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Send a message to {user.displayName}</DialogTitle>
                <DialogDescription>Your message will be sent to their email</DialogDescription>
              </DialogHeader>
              <UserAction
                loggedIn={<UserContactForm user={user} />}
                loggedOut={<UserContactNotLoggedIn displayName={user.displayName} />}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
