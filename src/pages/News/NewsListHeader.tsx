import { Link } from 'react-router';
import { UserRole } from 'oa-shared';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Button, Flex, Heading } from 'theme-ui';

import DraftButton from '../common/Drafts/DraftButton';
import { headings, listing } from './labels';

interface IProps {
  draftCount: number;
  handleShowDrafts: () => void;
  showDrafts: boolean;
}

export const NewsListHeader = (props: IProps) => {
  const { draftCount, handleShowDrafts, showDrafts } = props;
  const { isUserAuthorized } = useProfileStore();

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: [6, 12],
        paddingBottom: [4, 8],
        gap: [4, 8],
      }}
    >
      <Flex>
        <Heading
          as="h1"
          sx={{
            marginX: 'auto',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 5,
          }}
        >
          {headings.list}
        </Heading>
      </Flex>
      {isUserAuthorized(UserRole.ADMIN) && (
        <Flex
          sx={{
            justifyContent: 'space-between',
            flexDirection: ['column', 'column', 'row'],
            gap: [2, 2, 2],
            paddingX: [2, 0],
            maxWidth: '100%',
          }}
        >
          <Flex
            sx={{
              gap: 2,
              alignSelf: ['flex-start', 'flex-start', 'flex-end'],
              display: ['none', 'none', 'flex'],
            }}
          >
            <DraftButton
              showDrafts={showDrafts}
              draftCount={draftCount}
              handleShowDrafts={handleShowDrafts}
            />
            <Link to="/news/create">
              <Button type="button" data-cy="create-news" variant="primary">
                {listing.create}
              </Button>
            </Link>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
