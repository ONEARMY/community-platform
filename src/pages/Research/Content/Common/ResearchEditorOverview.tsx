import type { ResearchItem } from 'oa-shared';
import { useState } from 'react';
import { Link } from 'react-router';
import { useToast } from 'src/common/Toast/useToast';
import { logger } from 'src/logger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CheckIcon from '@/components/ui/icons/check.svg?react';
import ChevronDownIcon from '@/components/ui/icons/chevron-down.svg?react';
import ChevronUpIcon from '@/components/ui/icons/chevron-up.svg?react';
import CloseIcon from '@/components/ui/icons/close.svg?react';
import { researchService } from '../../research.service';

interface IProps {
  research: ResearchItem;
  newUpdateTitle?: string;
  sortable?: boolean;
  showCreateUpdateButton?: boolean;
  showBackToResearchButton?: boolean;
}

export const ResearchEditorOverview = (props: IProps) => {
  const { research, newUpdateTitle, sortable, showCreateUpdateButton, showBackToResearchButton } =
    props;
  const toast = useToast();
  const [savedUpdates, setSavedUpdates] = useState(research.updates.filter((u) => !u.deleted));
  const [updates, setUpdates] = useState(savedUpdates);
  const [isSaving, setIsSaving] = useState(false);
  const isOrderChanged = updates.some((u, index) => u.id !== savedUpdates[index].id);

  const moveUpdate = (fromIndex: number, toIndex: number) => {
    const reordered = [...updates];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setUpdates(reordered);
  };

  const saveOrder = async () => {
    setIsSaving(true);

    try {
      await researchService.reorderUpdates(
        research.id,
        updates.map((u) => u.id),
      );
      setSavedUpdates(updates);
      toast.success('Update order saved');
    } catch (error) {
      logger.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const items = [
    ...updates.map((u) => ({ id: u.id, title: u.title, isDraft: u.isDraft })),
    ...(newUpdateTitle !== undefined ? [{ id: null, title: newUpdateTitle, isDraft: true }] : []),
  ];

  return (
    <Card variant="flat">
      <h2 className="m-0 font-heading text-card-heading">Research overview</h2>

      {items.length > 0 && (
        <ol className="m-0 flex list-decimal flex-col gap-2.5 pl-5 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={item.id ?? 'new'}>
              <div className="flex items-center gap-1">
                <span className="flex flex-1 flex-wrap items-center gap-1">
                  {item.isDraft && <Badge variant="warning">Draft</Badge>}
                  {item.title}
                  {item.id !== null && (
                    <Link
                      to={`/research/${research.slug}/edit-update/${item.id}`}
                      className="text-info underline-offset-4 hover:underline"
                    >
                      Edit
                    </Link>
                  )}
                </span>
                {sortable && item.id !== null && (
                  <>
                    <Button
                      data-cy="move-update-up"
                      aria-label={`Move ${item.title} up`}
                      variant="ghost"
                      size="icon-xs"
                      type="button"
                      disabled={isSaving || index === 0}
                      onClick={() => moveUpdate(index, index - 1)}
                    >
                      <ChevronUpIcon />
                    </Button>
                    <Button
                      data-cy="move-update-down"
                      aria-label={`Move ${item.title} down`}
                      variant="ghost"
                      size="icon-xs"
                      type="button"
                      disabled={isSaving || index === updates.length - 1}
                      onClick={() => moveUpdate(index, index + 1)}
                    >
                      <ChevronDownIcon />
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-2.5 flex flex-wrap gap-2">
        {isOrderChanged && (
          <>
            <Button
              data-cy="save-update-order"
              size="sm"
              type="button"
              disabled={isSaving}
              onClick={saveOrder}
            >
              <CheckIcon />
              Save order
            </Button>
            <Button
              data-cy="cancel-update-order"
              variant="outline"
              size="sm"
              type="button"
              disabled={isSaving}
              onClick={() => setUpdates(savedUpdates)}
            >
              <CloseIcon />
              Cancel
            </Button>
          </>
        )}
        {showCreateUpdateButton && !isOrderChanged && (
          <Button
            data-cy="create-update"
            size="sm"
            nativeButton={false}
            render={<Link to={`/research/${research.slug}/new-update`} />}
          >
            Create update
          </Button>
        )}
        {showBackToResearchButton && (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link to={`/research/${research.slug}/edit`} />}
          >
            Back to research
          </Button>
        )}
      </div>
    </Card>
  );
};
