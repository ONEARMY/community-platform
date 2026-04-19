import { observer } from 'mobx-react';
import { Button, ConfirmModal } from 'oa-components';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { trackEvent } from 'src/common/Analytics';
import { useToast } from 'src/common/Toast';
import { libraryService } from '../../library.service';

type DeleteProjectButtonProps = {
  id: number;
};

const DeleteProjectButton = observer(({ id }: DeleteProjectButtonProps) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const promise = libraryService.deleteProject(id);

    toast.promise(promise, {
      loading: 'Deleting project...',
      success: () => {
        trackEvent({
          category: 'projects',
          action: 'deleted',
          label: `Project ID: ${id}`,
        });
        navigate('/library');
        setIsDeleting(false);
        return {
          message: `Project deleted!`,
        };
      },
      error: (error) => {
        console.error(error);
        setIsDeleting(false);
        return `Error: ${error.message}`;
      },
    });
  };

  return (
    <>
      <Button
        type="button"
        data-cy="Project: delete button"
        variant="destructive"
        disabled={isDeleting}
        sx={{ justifyContent: 'center' }}
        onClick={() => setShowDeleteModal(true)}
      >
        Delete
      </Button>

      <ConfirmModal
        key={id}
        isOpen={showDeleteModal}
        message="Are you sure you want to delete this Project?"
        confirmButtonText="Delete"
        handleCancel={() => setShowDeleteModal(false)}
        handleConfirm={handleDelete}
        confirmVariant="destructive"
      />
    </>
  );
});

export default DeleteProjectButton;
