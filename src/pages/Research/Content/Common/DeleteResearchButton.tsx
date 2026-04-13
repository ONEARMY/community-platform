import { observer } from 'mobx-react';
import { Button, ConfirmModal } from 'oa-components';
import { ResearchItem } from 'oa-shared';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { trackEvent } from 'src/common/Analytics';
import { useToast } from 'src/common/Toast';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { hasAdminRights } from 'src/utils/helpers';
import { researchService } from '../../research.service';

type DeleteResearchButtonProps = {
  research: ResearchItem;
};

const DeleteResearchButton = observer(({ research }: DeleteResearchButtonProps) => {
  const { profile } = useProfileStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isDeletable = useMemo(() => {
    return !!profile && (hasAdminRights(profile) || research.author?.username === profile.username);
  }, [profile, research.author]);

  const handleDelete = async (research: ResearchItem) => {
    const promise = researchService.deleteResearch(research.id);

    toast.promise(promise, {
      loading: 'Deleting research...',
      success: () => {
        trackEvent({
          category: 'research',
          action: 'deleted',
          label: research.title,
        });
        navigate('/research');
        return {
          message: `Research deleted!`,
        };
      },
      error: (error) => {
        console.error(error);
        return `Error: ${error.message}`;
      },
    });
  };

  if (!isDeletable) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        data-cy="Research: delete button"
        variant="destructive"
        disabled={research?.deleted}
        sx={{ justifyContent: 'center' }}
        onClick={() => setShowDeleteModal(true)}
      >
        Delete
      </Button>

      <ConfirmModal
        key={research?.id}
        isOpen={showDeleteModal}
        message="Are you sure you want to delete this Research?"
        confirmButtonText="Delete"
        handleCancel={() => setShowDeleteModal(false)}
        handleConfirm={() => handleDelete && handleDelete(research)}
        confirmVariant="destructive"
      />
    </>
  );
});

export default DeleteResearchButton;
