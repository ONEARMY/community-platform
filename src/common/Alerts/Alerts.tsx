import { UserAction } from '../UserAction';
import { AlertBanner } from './AlertBanner';
import { AlertIncompleteProfile } from './AlertIncompleteProfile';
import { AlertOrganisationModeration } from './AlertOrganisationModeration';

export const Alerts = () => {
  return (
    <>
      <AlertBanner />
      <AlertOrganisationModeration />
      <UserAction loggedIn={<AlertIncompleteProfile />} loggedOut={null} />
    </>
  );
};
