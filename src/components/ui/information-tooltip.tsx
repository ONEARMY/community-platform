import { cn } from '@/lib/utils';
import Information from './icons/information.svg?react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export function InformationTooltip({
  tooltip,
  className,
}: {
  tooltip: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span tabIndex={0} />}
        aria-label={tooltip}
        className={cn('inline-flex text-muted-foreground', className)}
      >
        <Information className="size-5" />
      </TooltipTrigger>
      <TooltipContent className="text-center">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
