import { Button, ReturnPathLink } from 'oa-components';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  displayName: string;
}

export const UserContactNotLoggedIn = ({ displayName }: Props) => {
  return (
    <Alert variant="info" data-cy="UserContactNotLoggedIn">
      <AlertDescription className="text-left">
        <p>{`${displayName} would love to hear from you...but you're not logged in!`}</p>
        <p>If you were you'd able to send them a message...</p>
        <div className="flex items-center gap-2">
          <ReturnPathLink
            to="/sign-in"
            style={{
              textDecoration: 'underline',
              color: 'inherit',
            }}
          >
            Login
          </ReturnPathLink>
          <ReturnPathLink to="/sign-up">
            <Button type="button" icon="star">
              Sign-up now
            </Button>
          </ReturnPathLink>
        </div>
      </AlertDescription>
    </Alert>
  );
};
