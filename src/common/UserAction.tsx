import { observer } from 'mobx-react';
import { useProfileStore } from 'src/stores/Profile/profile.store';

interface IProps {
  incompleteProfile?: React.ReactNode | null;
  loggedIn: React.ReactNode;
  loggedOut: React.ReactNode | null;
}

export const UserAction = observer((props: IProps) => {
  const { incompleteProfile, loggedIn, loggedOut } = props;
  const { isComplete, profile } = useProfileStore();

  if (!profile) {
    return loggedOut;
  }

  if (isComplete === false) {
    return incompleteProfile || loggedIn;
  }

  return loggedIn;
});
