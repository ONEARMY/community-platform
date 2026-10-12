import { UserRole } from 'oa-shared';
import { Link } from 'react-router';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Button, Flex, Heading, Text } from 'theme-ui';

import DraftButton from '../common/Drafts/DraftButton';
import { headings, listing } from './labels';

interface IProps {
  draftCount: number;
  handleShowDrafts: () => void;
  showDrafts: boolean;
}

export const NewsListHeader = (props: IProps) => {
  const { draftCount, handleShowDrafts, showDrafts } = props;
  const { profile, isUserAuthorized } = useProfileStore();

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
      <Flex
        sx={{
          flexDirection: 'column',
          gap: 3,
          width: '100%',
          maxWidth: '650px',
          paddingX: [2, 0],
        }}
      >
        {profile ? (
          <Heading as="h1" sx={{ fontSize: 6 }}>
            {`${headings.greeting}, ${profile.displayName}`}
          </Heading>
        ) : (
          <>
            <Heading as="h1" sx={{ fontSize: [8, 10, 11] }}>
              {headings.welcome}
            </Heading>
            <Text sx={{ fontSize: [3, 5], color: 'grey' }}>{headings.tagline}</Text>
          </>
        )}
      </Flex>
      {isUserAuthorized([UserRole.ADMIN, UserRole.EDITOR]) && (
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
