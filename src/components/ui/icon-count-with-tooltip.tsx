import Comment from './icons/comment.svg?react';
import Eye from './icons/eye.svg?react';
import StarActive from './icons/star-active.svg?react';
import Update from './icons/update.svg?react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

const icons = {
  comment: Comment,
  show: Eye,
  'star-active': StarActive,
  update: Update,
};

function shortFormatNumber(num: number): string {
  const units = [
    { value: 1000000, suffix: 'M' },
    { value: 1000, suffix: 'K' },
  ];

  for (const { value, suffix } of units) {
    if (num >= value) {
      return (num / value).toFixed(1).replace(/\.0$/, '') + suffix;
    }
  }

  return num.toString();
}

export function IconCountWithTooltip({
  count,
  dataCy,
  icon,
  text,
}: {
  count: number;
  dataCy?: string;
  icon: keyof typeof icons;
  text: string;
}) {
  const Icon = icons[icon];

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span tabIndex={0} />}
        data-cy={dataCy}
        aria-label={`${text}: ${count}`}
        className="inline-flex items-center text-xs text-foreground sm:text-sm"
      >
        {shortFormatNumber(count)}
        <Icon className="ml-1 size-4" />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
