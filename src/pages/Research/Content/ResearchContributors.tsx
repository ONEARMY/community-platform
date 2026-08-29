import { Username } from 'oa-components';
import type { Author } from 'oa-shared';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MAX_VISIBLE_AVATARS = 3;

const ContributorAvatar = ({ contributor }: { contributor: Author }) => {
  const className = 'size-6 shrink-0 rounded-full ring-2 ring-background';
  const name = contributor.displayName || contributor.username || '';

  if (!contributor.photo) {
    return (
      <span
        aria-hidden="true"
        className={`${className} flex items-center justify-center bg-muted text-xs text-muted-foreground`}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      alt={name}
      className={`${className} object-cover`}
      loading="lazy"
      src={contributor.photo.publicUrl}
    />
  );
};

const contributorKey = (contributor: Author, index: number) => contributor.username ?? index;

interface IProps {
  contributors: Author[];
}

export const ResearchContributors = ({ contributors }: IProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (contributors.length === 0) {
    return null;
  }

  const label = `${contributors.length} contributors`;

  return (
    <div className="flex items-center gap-1 text-sm" data-cy="research-contributors">
      <span className="text-muted-foreground">with</span>

      {contributors.length === 1 ? (
        <span className="flex items-center gap-1">
          <ContributorAvatar contributor={contributors[0]} />
          <Username user={contributors[0]} />
        </span>
      ) : (
        <>
          <button
            aria-label={`Show all ${label}`}
            className="flex cursor-pointer items-center gap-2 rounded-full px-1 py-0.5 hover:bg-muted"
            data-cy="research-contributors-trigger"
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            <span className="flex -space-x-2">
              {contributors.slice(0, MAX_VISIBLE_AVATARS).map((contributor, index) => (
                <ContributorAvatar
                  contributor={contributor}
                  key={contributorKey(contributor, index)}
                />
              ))}
            </span>
            <span className="underline">{label}</span>
          </button>

          <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{label}</DialogTitle>
              </DialogHeader>
              <ul className="flex max-h-96 flex-col gap-3 overflow-y-auto">
                {contributors.map((contributor, index) => (
                  <li className="flex items-center gap-2" key={contributorKey(contributor, index)}>
                    <ContributorAvatar contributor={contributor} />
                    <Username user={contributor} />
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};
