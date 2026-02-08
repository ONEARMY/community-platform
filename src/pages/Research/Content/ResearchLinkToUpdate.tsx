import { Icon, Tooltip } from 'oa-components';
import type { ResearchItem, ResearchUpdate } from 'oa-shared';
import { useState } from 'react';
import { Button } from 'theme-ui';

interface IProps {
  research: ResearchItem;
  update: ResearchUpdate;
}

const COPY_TO_CLIPBOARD = 'Share this update';
const SUCCESS = 'Link copied to clipboard!';

export const ResearchLinkToUpdate = ({ research, update }: IProps) => {
  const [showCheck, setShowCheck] = useState(false);

  const copyURLtoClipboard = async (slug: string, id: number) => {
    await navigator.clipboard.writeText(`${location.origin}/research/${slug}#update_${id}`);
    setShowCheck(true);

    setTimeout(() => {
      setShowCheck(false);
    }, 2000);
  };

  return (
    <Button
      variant="subtle"
      onClick={() => copyURLtoClipboard(research.slug, update.id)}
      data-cy="ResearchLinkToUpdate"
      data-tooltip-id="link-update"
      data-tooltip-content={showCheck ? SUCCESS : COPY_TO_CLIPBOARD}
    >
      {showCheck ? <Icon glyph="check" color="green" size={30} /> : <Icon glyph="hyperlink" size={30} />}
      <Tooltip id="link-update" />
    </Button>
  );
};
