import { observer } from 'mobx-react';
import { Button, ConfirmModal } from 'oa-components';
import type { ResearchItem } from 'oa-shared';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { trackEvent } from 'src/common/Analytics';
import PageHeader from 'src/common/PageHeader';
import { logger } from 'src/logger';
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs';
import { getResearchCommentId, getResearchUpdateId } from 'src/pages/Research/Content/helper';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { hasAdminRights } from 'src/utils/helpers';
import { Box, Flex } from 'theme-ui';
import { researchService } from '../research.service';
import ResearchDescription from './ResearchDescription';
import ResearchEngagementSection from './ResearchEngagementSection';
import ResearchUpdate from './ResearchUpdate';

interface IProps {
  research: ResearchItem;
}

export const ResearchArticlePage = observer(({ research }: IProps) => {
  const location = useLocation();
  const { profile: activeUser } = useProfileStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const scrollIntoRelevantSection = () => {
    if (getResearchCommentId(location.hash) === '') return;
    const section = document.getElementById(`update_${getResearchUpdateId(location.hash)}`);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    scrollIntoRelevantSection();
  }, [location.hash]);

  const isEditable = useMemo(() => {
    return (
      !!activeUser &&
      (hasAdminRights(activeUser) ||
        research.author?.username === activeUser.username ||
        research.collaborators?.map((c) => c.username).includes(activeUser.username))
    );
  }, [activeUser, research.author]);

  const isDeletable = useMemo(() => {
    return !!activeUser && (hasAdminRights(activeUser) || research.author?.username === activeUser.username);
  }, [activeUser, research.author]);

  const sortedUpdates = useMemo(() => {
    return research?.updates?.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [research?.updates]);

  const handleDelete = async (research: ResearchItem) => {
    try {
      await researchService.deleteResearch(research.id);
      trackEvent({
        category: 'research',
        action: 'deleted',
        label: research.title,
      });

      navigate('/research');
    } catch (err) {
      logger.error(err);
      // at least log the error
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
      <PageHeader
        actions={
          (isDeletable || isEditable) && (
            <Flex
              sx={{
                gap: 2,
                paddingLeft: 2,
                width: ['100%', 'auto', 'auto'],
                justifyContent: 'flex-end',
              }}
            >
              {isEditable && (
                <Link to={'/research/' + research.slug + '/edit'}>
                  <Button type="button" variant="primary" data-cy="edit">
                    Edit
                  </Button>
                </Link>
              )}
              {isDeletable && (
                <>
                  <Button
                    type="button"
                    data-cy="Research: delete button"
                    variant="destructive"
                    disabled={research.deleted}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </Button>

                  <ConfirmModal
                    key={research.id}
                    isOpen={showDeleteModal}
                    message="Are you sure you want to delete this Research?"
                    confirmButtonText="Delete"
                    handleCancel={() => setShowDeleteModal(false)}
                    handleConfirm={() => handleDelete && handleDelete(research)}
                    confirmVariant="destructive"
                  />
                </>
              )}
            </Flex>
          )
        }
      >
        <Breadcrumbs
          steps={[
            { text: 'Research', link: '/research' },
            ...(research.category
              ? [
                  {
                    text: research.category.name,
                    link: `/research?category=${research.category.id}`,
                  },
                ]
              : []),
            { text: research.title },
          ]}
        />
      </PageHeader>

      <ResearchDescription research={research} />

      <Flex
        sx={{
          flexDirection: 'column',
          marginTop: [2, 4],
          marginBottom: 4,
          gap: [4, 6],
        }}
      >
        {sortedUpdates?.map((update, index) => (
          <ResearchUpdate
            research={research}
            update={update}
            key={update.id}
            updateIndex={index}
            isEditable={isEditable}
            slug={research.slug}
          />
        ))}
      </Flex>

      <ClientOnly fallback={<></>}>{() => <ResearchEngagementSection research={research} />}</ClientOnly>

      {isEditable && (
        <Flex sx={{ my: 4 }}>
          <Link to={`/research/${research.slug}/new-update`}>
            <Button
              type="button"
              large
              sx={{
                marginLeft: 2,
                marginBottom: [3, 3, 0],
              }}
              data-cy="addResearchUpdateButton"
            >
              Add update
            </Button>
          </Link>
        </Flex>
      )}
    </Box>
  );
});
