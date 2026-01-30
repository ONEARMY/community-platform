import { Link } from 'react-router';
import { UserRole } from 'oa-shared';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { UserAction } from 'src/common/UserAction';
import { Button } from 'theme-ui';

import DraftButton from '../common/Drafts/DraftButton';
import { ListHeader } from '../common/Layout/ListHeader';
import { headings, listing } from './labels';

interface IProps {
  draftCount: number;
  handleShowDrafts: () => void;
  showDrafts: boolean;
}

export const NewsListHeader = (props: IProps) => {
  const { draftCount, handleShowDrafts, showDrafts } = props;

  const actionComponents = (
    <UserAction
      incompleteProfile={<></>}
      loggedIn={
        <AuthWrapper roleRequired={UserRole.ADMIN}>
          {showDrafts && (
            <DraftButton
              showDrafts={showDrafts}
              draftCount={draftCount}
              handleShowDrafts={handleShowDrafts}
            />
          )}
          <Link to="/news/create">
            <Button type="button" data-cy="create-news" variant="primary">
              {listing.create}
            </Button>
          </Link>
        </AuthWrapper>
      }
      loggedOut={<></>}
    />
  );

  return (
    <ListHeader
      actionComponents={actionComponents}
      showDrafts={showDrafts}
      headingTitle={headings.list}
    />
  );
};
