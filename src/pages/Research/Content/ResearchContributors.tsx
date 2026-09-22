import { Username } from 'oa-components';
import type { Author } from 'oa-shared';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MAX_VISIBLE_AVATARS = 3;

interface AvatarProps {
  contributor: Author;
  className: string;
}

const ContributorAvatar = ({ contributor, className }: AvatarProps) => {
  const name = contributor.displayName || contributor.username || '';

  return (
    <Avatar aria-hidden="true" ring className={className}>
      {contributor.photo ? (
        <AvatarImage alt="" loading="lazy" src={contributor.photo.publicUrl} />
      ) : null}
      <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

const contributorKey = (contributor: Author, index: number) => contributor.username ?? index;

interface IProps {
  contributors: Author[];
}

export const ResearchContributors = ({ contributors }: IProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  if (contributors.length === 0) {
    return null;
  }

  const label = `${contributors.length} contributors`;

  return (
    <div className="flex items-center gap-1 text-sm" data-cy="research-contributors">
      <span className="text-muted-foreground">with</span>

      {contributors.length === 1 ? (
        <span className="flex items-center gap-2">
          <ContributorAvatar className="size-5" contributor={contributors[0]} />
          <Username user={contributors[0]} />
        </span>
      ) : (
        <>
          <button
            aria-label={`Show all ${label}`}
            className="flex cursor-pointer rounded-s p-1 items-center gap-1 border border-transparent hover:border-highlight-hover hover:bg-softblue"
            data-cy="research-contributors-trigger"
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            <div className="flex -space-x-2">
              {contributors.slice(0, MAX_VISIBLE_AVATARS).map((contributor, index) => (
                <ContributorAvatar
                  className="size-5"
                  contributor={contributor}
                  key={contributorKey(contributor, index)}
                />
              ))}
            </div>
            <span>{label}</span>
          </button>

          <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
            <DialogContent variant="strong" initialFocus={modalRef} ref={modalRef}>
              <DialogHeader variant="strong">
                <DialogTitle>{label}</DialogTitle>
              </DialogHeader>
              <ul className="flex max-h-96 flex-col gap-4 overflow-y-auto px-4 py-3">
                {contributors.map((contributor, index) => (
                  <li className="flex items-center gap-2" key={contributorKey(contributor, index)}>
                    <ContributorAvatar className="size-8" contributor={contributor} />
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
