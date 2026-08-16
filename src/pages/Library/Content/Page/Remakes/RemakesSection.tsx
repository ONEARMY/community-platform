import { Button, ConfirmModal, Pagination } from 'oa-components';
import type { Project, Remake } from 'oa-shared';
import { useContext, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import remakesEmptyStateImage from 'src/assets/images/remakes-empty-state.png';
import { logger } from 'src/logger';
import { SessionContext } from 'src/pages/common/SessionContext';
import { remakeService } from 'src/services/remakeService';
import { buildStatisticsLabel } from 'src/utils/helpers';
import { Box, Flex, Image, Text } from 'theme-ui';
import { REMAKE_DELETE_CONFIRM_MESSAGE, REMAKES_PER_PAGE } from './constants';
import { useRemakes } from './hooks/useRemakes';
import { RemakeCard } from './RemakeCard';
import { RemakeFormModal } from './RemakeFormModal';
import { RemakeGhostCard } from './RemakeGhostCard';
import { RemakeViewModal } from './RemakeViewModal';

interface IProps {
  project: Project;
  onRemakeCountChange?: (count: number) => void;
}

const DELETE_ERROR_MESSAGE = 'Error deleting remake. Please try again.';

export const RemakesSection = ({ project, onRemakeCountChange }: IProps) => {
  const claims = useContext(SessionContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!claims?.sub;

  const { remakes, isLoading, error, refetch, addRemake, replaceRemake, removeRemake } = useRemakes(
    project.id,
    onRemakeCountChange,
  );

  const [page, setPage] = useState(1);
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formRemake, setFormRemake] = useState<Remake | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Remake | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.max(1, Math.ceil(remakes.length / REMAKES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const displayedRemakes = useMemo(
    () => remakes.slice((currentPage - 1) * REMAKES_PER_PAGE, currentPage * REMAKES_PER_PAGE),
    [remakes, currentPage],
  );

  const openAddForm = () => {
    if (!isLoggedIn) {
      navigate(`/sign-in?returnUrl=${encodeURIComponent(location.pathname)}`);
      return;
    }

    setFormRemake(null);
    setIsFormOpen(true);
  };

  const openEditForm = (remake: Remake) => {
    setViewIndex(null);
    setFormRemake(remake);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormRemake(null);
  };

  const handleCreated = (remake: Remake) => {
    closeForm();

    if (isLoading || error) {
      refetch();
      return;
    }

    addRemake(remake);
    setPage(1);
  };

  const handleUpdated = (remake: Remake) => {
    replaceRemake(remake);
    closeForm();
  };

  const handleDeleted = (remakeId: number) => {
    removeRemake(remakeId);
    setViewIndex(null);
    setDeleteTarget(null);
    closeForm();
  };

  const openDeleteConfirm = (remake: Remake) => {
    setDeleteError(null);
    setDeleteTarget(remake);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await remakeService.deleteRemake(project.id, deleteTarget.id);

      if (response.status !== 204) {
        setDeleteError(DELETE_ERROR_MESSAGE);
        return;
      }

      setDeleteError(null);
      handleDeleted(deleteTarget.id);
    } catch (err) {
      logger.error(err);
      setDeleteError(DELETE_ERROR_MESSAGE);
    } finally {
      setIsDeleting(false);
    }
  };

  const countLabel =
    remakes.length === 0
      ? 'Remakes'
      : `${remakes.length} ${buildStatisticsLabel({
          stat: remakes.length,
          statUnit: 'remake',
          usePlural: true,
        })}`;

  const hasLoadedRemakes = !isLoading && !error;
  const showEmptyState = hasLoadedRemakes && remakes.length === 0;
  const showRemakesGrid = hasLoadedRemakes && remakes.length > 0;

  return (
    <Flex data-cy="remakes-section" sx={{ flexDirection: 'column', gap: 3 }}>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Text data-cy="remakes-count" sx={{ fontFamily: 'title', fontSize: 4 }}>
          {countLabel}
        </Text>
        <Button type="button" variant="primary" data-cy="upload-remake" onClick={openAddForm}>
          Upload your remake
        </Button>
      </Flex>

      {error && (
        <Flex sx={{ alignItems: 'center', gap: 3 }}>
          <Text
            data-cy="remakes-fetch-error"
            sx={{ fontFamily: 'body', fontSize: 2, color: 'red' }}
          >
            {error}
          </Text>
          <Button type="button" variant="outline" data-cy="remakes-retry" onClick={refetch}>
            Try again
          </Button>
        </Flex>
      )}

      {showEmptyState && (
        <Flex
          data-cy="remakes-empty-state"
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            gap: [14, 14, 2],
            paddingY: [8, 8, 2],
          }}
        >
          <Image src={remakesEmptyStateImage} alt="" sx={{ width: '110px', height: '110px' }} />
          <Flex sx={{ flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Text sx={{ fontFamily: 'title', fontSize: 4 }}>Make this and share with us!</Text>
            <Text sx={{ fontFamily: 'title', fontSize: 2, color: 'darkGrey' }}>
              Try this tutorial and share with the community.
            </Text>
          </Flex>
        </Flex>
      )}

      {showRemakesGrid && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: ['1fr', 'repeat(3, 1fr)'],
            columnGap: 2,
            rowGap: 4,
          }}
        >
          {displayedRemakes.map((remake, index) => (
            <RemakeCard
              key={remake.id}
              remake={remake}
              onClick={() => setViewIndex((currentPage - 1) * REMAKES_PER_PAGE + index)}
            />
          ))}
          {remakes.length === 1 && <RemakeGhostCard onUploadClick={openAddForm} />}
        </Box>
      )}

      {showRemakesGrid && totalPages > 1 && (
        <Flex sx={{ justifyContent: 'center' }}>
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </Flex>
      )}

      {viewIndex !== null && (
        <RemakeViewModal
          remakes={remakes}
          activeIndex={viewIndex}
          isNavDisabled={!!deleteTarget}
          onChangeIndex={setViewIndex}
          onClose={() => setViewIndex(null)}
          onEdit={openEditForm}
          onDelete={openDeleteConfirm}
        />
      )}

      {isFormOpen && (
        <RemakeFormModal
          project={project}
          remake={formRemake}
          onClose={closeForm}
          onCreated={handleCreated}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        message={REMAKE_DELETE_CONFIRM_MESSAGE}
        confirmButtonText="Delete"
        confirmVariant="destructive"
        handleCancel={() => {
          if (isDeleting) {
            return;
          }

          setDeleteTarget(null);
          setDeleteError(null);
        }}
        handleConfirm={handleDeleteConfirmed}
      >
        {deleteError && (
          <Text
            data-cy="remake-delete-error"
            sx={{ fontFamily: 'body', fontSize: 2, color: 'red' }}
          >
            {deleteError}
          </Text>
        )}
      </ConfirmModal>
    </Flex>
  );
};
