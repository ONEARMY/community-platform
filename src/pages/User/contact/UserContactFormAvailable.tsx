import { Alert, AlertDescription } from '@/components/ui/alert';

interface IProps {
  isUserProfileContactable: boolean;
}

export const UserContactFormAvailable = ({ isUserProfileContactable }: IProps) => {
  return (
    <Alert variant="info">
      <AlertDescription className="text-left">
        {isUserProfileContactable ? (
          <p data-cy="UserContactForm-Available">Other users are able to contact you</p>
        ) : (
          <p data-cy="UserContactForm-NotAvailable">Other users are not able to contact you</p>
        )}
        <p>You can change that by editing your profile</p>
      </AlertDescription>
    </Alert>
  );
};
