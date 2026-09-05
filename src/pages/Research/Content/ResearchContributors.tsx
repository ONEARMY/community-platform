import { Username } from 'oa-components';
import type { Author } from 'oa-shared';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const MAX_VISIBLE_AVATARS = 3;

// The surrounding page is theme-ui, whose body font is Inter, while this
// component library defaults to Geist. Match the page rather than the library.
const FONT_FAMILY = 'font-[Inter,Arial,sans-serif]';

interface AvatarProps {
  contributor: Author;
  className: string;
}

// Decorative: the name is always rendered next to it, and the trigger carries
// its own aria-label, so the avatar adds nothing for a screen reader.
const ContributorAvatar = ({ contributor, className }: AvatarProps) => {
  const name = contributor.displayName || contributor.username || '';

  return (
    <Avatar aria-hidden="true" className={cn(className, 'ring-2 ring-background')}>
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
    <div
      className={`${FONT_FAMILY} flex items-center gap-[5px] text-sm`}
      data-cy="research-contributors"
    >
      <span className="text-muted-foreground">with</span>

      {contributors.length === 1 ? (
        <span className="flex items-center gap-[5px]">
          <ContributorAvatar className="size-[25px]" contributor={contributors[0]} />
          <Username user={contributors[0]} />
        </span>
      ) : (
        <>
          <button
            aria-label={`Show all ${label}`}
            className="flex cursor-pointer items-center gap-[5px] rounded-full border border-transparent px-1 py-0.5 hover:border-border hover:bg-muted"
            data-cy="research-contributors-trigger"
            onClick={() => setIsModalOpen(true)}
            type="button"
          >
            <span className="flex -space-x-2">
              {contributors.slice(0, MAX_VISIBLE_AVATARS).map((contributor, index) => (
                <ContributorAvatar
                  className="size-[25px]"
                  contributor={contributor}
                  key={contributorKey(contributor, index)}
                />
              ))}
            </span>
            <span>{label}</span>
          </button>

          <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
            <DialogContent
              className={`${FONT_FAMILY} gap-0 rounded-lg border border-black p-0 ring-0`}
              // Without this the first contributor's link takes focus on open
              // and the row reads as selected.
              initialFocus={modalRef}
              ref={modalRef}
            >
              <DialogHeader className="border-b border-black px-4 py-3">
                <DialogTitle className="text-base">{label}</DialogTitle>
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
