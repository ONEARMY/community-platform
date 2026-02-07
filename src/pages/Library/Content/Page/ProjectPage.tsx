import { observer } from 'mobx-react';
import {
  ArticleCallToActionSupabase,
  Button,
  ConfirmModal,
  UsefulStatsButton,
  UserEngagementWrapper,
} from 'oa-components';
import type { ContentType, Project, ProjectStep } from 'oa-shared';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { trackEvent } from 'src/common/Analytics';
import { DonationRequestModalContainer } from 'src/common/DonationRequestModalContainer';
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs';
import { CommentSectionSupabase } from 'src/pages/common/CommentsSupabase/CommentSectionSupabase';
import { usefulService } from 'src/services/usefulService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { hasAdminRights } from 'src/utils/helpers';
import { onUsefulClick } from 'src/utils/onUsefulClick';
import { Card, Flex } from 'theme-ui';
import { libraryService } from '../../library.service';
import { LibraryDescription } from './LibraryDescription';
import Step from './LibraryStep';

interface ProjectPageProps {
  item: Project;
}

export const ProjectPage = observer(({ item }: ProjectPageProps) => {
  const [voted, setVoted] = useState<boolean>(false);
  const [usefulCount, setUsefulCount] = useState<number>(item.usefulCount);
  const { profile: activeUser } = useProfileStore();
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  useEffect(() => {
    const getVoted = async () => {
      const voted = await usefulService.hasVoted('projects', item.id);
      setVoted(voted);
    };

    if (activeUser) {
      getVoted();
    }
  }, [activeUser, item]);

  const configOnUsefulClick = {
    contentType: 'projects' as ContentType,
    contentId: item.id,
    eventCategory: 'Library',
    slug: item.slug,
    setVoted,
    setUsefulCount,
    loggedInUser: activeUser,
  };

  const handleUsefulClick = async (vote: 'add' | 'delete') => {
    await onUsefulClick({
      vote,
      config: { ...configOnUsefulClick, eventCategory: 'projects' },
    });
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await libraryService.deleteProject(item.id);
      trackEvent({
        category: 'projects',
        action: 'deleted',
        label: item.title,
      });

      navigate('/library');
    } catch (err) {
      console.error(err);
    }
  };

  const isEditable = useMemo(() => {
    return (
      !!activeUser && (hasAdminRights(activeUser) || item.author?.username === activeUser.username)
    );
  }, [activeUser, item.author]);

  return (
    <>
      <Breadcrumbs content={item} variant="library">
        {isEditable && (
          <Flex sx={{ gap: 2, paddingLeft: 2 }}>
            <Link to={'/library/' + item.slug + '/edit'} data-cy="edit">
              <Button type="button" variant="primary">
                Edit
              </Button>
            </Link>

            <Button
              type="button"
              data-cy="Library: delete button"
              variant={'secondary'}
              icon="delete"
              disabled={item.deleted}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>

            <ConfirmModal
              isOpen={showDeleteModal}
              message="Are you sure you want to delete this project?"
              confirmButtonText="Delete"
              handleCancel={() => setShowDeleteModal(false)}
              handleConfirm={() => handleDelete()}
            />
          </Flex>
        )}
      </Breadcrumbs>

      <LibraryDescription
        item={item}
        loggedInUser={activeUser}
        commentsCount={item.commentCount}
        votedUsefulCount={usefulCount}
        hasUserVotedUseful={voted}
        onUsefulClick={() => handleUsefulClick(voted ? 'delete' : 'add')}
      />
      <Flex sx={{ flexDirection: 'column', marginTop: [3, 4], gap: 4 }}>
        {item.steps
          .sort((a, b) => a.order - b.order)
          .map((step: ProjectStep, index: number) => (
            <Step step={step} key={index} stepindex={index} />
          ))}
      </Flex>
      <ClientOnly fallback={<></>}>
        {() => (
          <UserEngagementWrapper>
            <ArticleCallToActionSupabase author={item.author!}>
              <Button
                type="button"
                sx={{ fontSize: 2, justifyContent: 'center' }}
                onClick={() => {
                  document
                    .querySelector('[data-target="create-comment-container"]')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  (
                    document.querySelector('[data-cy="comments-form"]') as HTMLTextAreaElement
                  )?.focus();

                  return false;
                }}
              >
                Leave a comment
              </Button>
              {item.moderation === 'accepted' && (
                <UsefulStatsButton
                  hasUserVotedUseful={voted}
                  isLoggedIn={!!activeUser}
                  onUsefulClick={() => handleUsefulClick(voted ? 'delete' : 'add')}
                />
              )}
              {item.author?.profileType?.isSpace && item.author?.donationsEnabled && (
                <>
                  <DonationRequestModalContainer
                    profileId={item.author?.id}
                    isOpen={isDonationModalOpen}
                    onDidDismiss={() => setIsDonationModalOpen(false)}
                  />
                  <Button
                    icon="donate"
                    variant="outline"
                    iconColor="primary"
                    sx={{ fontSize: '14px', backgroundColor: '#fff' }}
                    onClick={() => {
                      trackEvent({
                        action: 'donationModalOpened',
                        category: 'projects',
                        label: item.author?.username || '',
                      });
                      setIsDonationModalOpen(true);
                    }}
                  >
                    Support the author
                  </Button>
                </>
              )}
            </ArticleCallToActionSupabase>
            <Card
              sx={{
                background: 'softblue',
                gap: 2,
                padding: 3,
                width: ['100%', '100%', `90%`, `${(2 / 3) * 100}%`],
                margin: '0 auto',
                mt: 5,
              }}
            >
              <CommentSectionSupabase
                authors={item.author?.id ? [item.author?.id] : []}
                sourceId={item.id}
                sourceType="projects"
              />
            </Card>
          </UserEngagementWrapper>
        )}
      </ClientOnly>
    </>
  );
});
