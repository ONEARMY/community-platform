import type { PinProfile } from 'oa-shared';
import { UserAction } from '@/common/UserAction';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserContactForm } from '@/pages/User/contact/UserContactForm';
import { UserContactFormNotLoggedIn } from '@/pages/User/contact/UserContactFormNotLoggedIn';

interface ContactDialogProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  user: PinProfile | null;
}

export const ContactDialog = ({ onOpenChange, open, user }: ContactDialogProps) => {
  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact {user.displayName}</DialogTitle>
        </DialogHeader>
        <UserAction
          loggedIn={<UserContactForm user={user} />}
          loggedOut={<UserContactFormNotLoggedIn user={user} />}
        />
      </DialogContent>
    </Dialog>
  );
};
