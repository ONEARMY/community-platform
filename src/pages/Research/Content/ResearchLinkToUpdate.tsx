import { Icon } from 'oa-components';
import type { ResearchItem, ResearchUpdate } from 'oa-shared';
import { useState } from 'react';
import { Button } from 'theme-ui';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface IProps {
  research: ResearchItem;
  update: ResearchUpdate;
}

const COPY_TO_CLIPBOARD = 'Share this update';
const SUCCESS = 'Link copied to clipboard!';

export const ResearchLinkToUpdate = ({ research, update }: IProps) => {
  const [showCheck, setShowCheck] = useState(false);

  const copyURLtoClipboard = async (slug: string, id: number) => {
    try {
      // this try-catch is mainly for cypress not to error
      await navigator.clipboard.writeText(`${location.origin}/research/${slug}#update_${id}`);
    } catch (_) {}
    setShowCheck(true);

    setTimeout(() => {
      setShowCheck(false);
    }, 2000);
  };

  const label = showCheck ? SUCCESS : COPY_TO_CLIPBOARD;

  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant="subtle" />}
        closeOnClick={false}
        onClick={() => copyURLtoClipboard(research.slug, update.id)}
        data-cy="ResearchLinkToUpdate"
        aria-label={label}
      >
        {showCheck ? (
          <Icon glyph="check" color="green" size={30} />
        ) : (
          <Icon glyph="hyperlink" size={30} />
        )}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
