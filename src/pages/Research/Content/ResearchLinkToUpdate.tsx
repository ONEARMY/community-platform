import { Icon, InternalLink, Tooltip } from 'oa-components';
import type { ResearchItem, ResearchUpdate } from 'oa-shared';
import { useState } from 'react';

interface IProps {
  research: ResearchItem;
  update: ResearchUpdate;
}

const COPY_TO_CLIPBOARD = 'Copy link to update';
const IN_PROGRESS = '...Working on it...';
const SUCCESS = 'Nice. All done. Now share away...!';

export const ResearchLinkToUpdate = ({ research, update }: IProps) => {
  const [label, setLabel] = useState<string>(COPY_TO_CLIPBOARD);

  const copyURLtoClipboard = async (slug: string, id: number) => {
    setLabel(IN_PROGRESS);
    try {
      await navigator.clipboard.writeText(`${location.origin}/research/${slug}#update_${id}`);
      setLabel(SUCCESS);
    } catch (error) {
      setLabel(error.message);
    }
  };

  return (
    <InternalLink
      to={`/research/${research.slug}#update_${update.id}`}
      onClick={async () => copyURLtoClipboard(research.slug, update.id)}
      data-cy="ResearchLinkToUpdate"
    >
      <Icon
        glyph="hyperlink"
        data-tooltip-id="link-update"
        data-tooltip-content={label}
        size={30}
      />
      <Tooltip id="link-update" />
    </InternalLink>
  );
};
