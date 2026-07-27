import { Button, ConfirmModal, Pagination } from 'oa-components';
import type { Project, Remake } from 'oa-shared';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import remakesEmptyStateImage from 'src/assets/images/remakes-empty-state.png';
import { SessionContext } from 'src/pages/common/SessionContext';
import { remakeService } from 'src/services/remakeService';
import { buildStatisticsLabel } from 'src/utils/helpers';
import { Box, Flex, Image, Text } from 'theme-ui';
import { REMAKE_DELETE_CONFIRM_MESSAGE, REMAKES_PER_PAGE } from './constants';
import { RemakeCard } from './RemakeCard';
import { RemakeFormModal } from './RemakeFormModal';
import { RemakeGhostCard } from './RemakeGhostCard';
import { RemakeViewModal } from './RemakeViewModal';

interface IProps {
  project: Project;
  onRemakeCountChange?: (count: number) => void;
}

export const RemakesSection = ({ project, onRemakeCountChange }: IProps) => {
  const claims = useContext(SessionContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!claims?.sub;

  const [remakes, setRemakes] = useState<Remake[]>([]);
  const [page, setPage] = useState(1);
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  const [formRemake, setFormRemake] = useState<Remake | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Remake | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setFetchError(null);
    setRemakes([]);
    setPage(1);
    setViewIndex(null);
    setIsFormOpen(false);
    setFormRemake(null);
    setDeleteTarget(null);
    setDeleteError(null);

    const fetchRemakes = async () => {
      try {
        const result = await remakeService.getRemakes(project.id);

        if (!ignore) {
          setRemakes(result);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          setFetchError('Error loading remakes. Please try again later.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchRemakes();

    return () => {
      ignore = true;
    };
  }, [project.id, reloadKey]);

  const refetchRemakes = () => setReloadKey((current) => current + 1);

  useEffect(() => {
    if (isLoading || fetchError) {
      return;
    }

    onRemakeCountChange?.(remakes.length);
  }, [remakes.length, isLoading, fetchError, onRemakeCountChange]);

  const totalPages = Math.ceil(remakes.length / REMAKES_PER_PAGE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const displayedRemakes = useMemo(() => {
    return remakes.slice((currentPage - 1) * REMAKES_PER_PAGE, currentPage * REMAKES_PER_PAGE);
  }, [remakes, currentPage]);

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

    if (isLoading || fetchError) {
      refetchRemakes();
      return;
    }

    setRemakes((current) => [remake, ...current]);
    setPage(1);
  };

  const handleUpdated = (remake: Remake) => {
    setRemakes((current) => current.map((x) => (x.id === remake.id ? remake : x)));
    closeForm();
  };

  const handleDeleted = (remakeId: number) => {
    setRemakes((current) => current.filter((x) => x.id !== remakeId));
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

      if (response.status === 204) {
        setDeleteError(null);
        handleDeleted(deleteTarget.id);
        return;
      }

      setDeleteError('Error deleting remake. Please try again.');
    } catch (error) {
      console.error(error);
      setDeleteError('Error deleting remake. Please try again.');
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

  const hasLoadedRemakes = !isLoading && !fetchError;
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

      {fetchError && (
        <Flex sx={{ alignItems: 'center', gap: 3 }}>
          <Text
            data-cy="remakes-fetch-error"
            sx={{ fontFamily: 'body', fontSize: 2, color: 'red' }}
          >
            {fetchError}
          </Text>
          <Button type="button" variant="outline" data-cy="remakes-retry" onClick={refetchRemakes}>
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
          {displayedRemakes.map((remake) => (
            <RemakeCard
              key={remake.id}
              remake={remake}
              onClick={() => setViewIndex(remakes.indexOf(remake))}
            />
          ))}
          {remakes.length === 1 && <RemakeGhostCard onUploadClick={openAddForm} />}
        </Box>
      )}

      {showRemakesGrid && totalPages > 1 && (
        <Flex sx={{ justifyContent: 'center', '& input': { backgroundColor: 'softblue' } }}>
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
