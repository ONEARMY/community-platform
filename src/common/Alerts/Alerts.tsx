import { UserAction } from '../UserAction';
import { AlertBanner } from './AlertBanner';
import { AlertIncompleteProfile } from './AlertIncompleteProfile';

export const Alerts = () => {
  return (
    <>
      <AlertBanner />
      <UserAction loggedIn={<AlertIncompleteProfile />} loggedOut={null} />
    </>
  );
};
