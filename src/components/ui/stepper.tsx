import type * as React from 'react';
import { cn } from '@/lib/utils';

function Stepper({
  steps,
  activeStep,
  className,
  ...props
}: React.ComponentProps<'div'> & { steps: string[]; activeStep: number }) {
  return (
    <div
      data-slot="stepper"
      data-cy="Stepper"
      className={cn('flex w-full gap-2.5', className)}
      {...props}
    >
      {steps.map((step, index) => {
        const isReached = index <= activeStep;
        const isActive = index === activeStep;

        return (
          <div
            key={step}
            data-cy={`Stepper-step-${index}`}
            data-active={isActive || undefined}
            className="flex flex-1 flex-col items-center gap-2.5"
          >
            <div
              className={cn('h-[5px] w-full rounded-full', isReached ? 'bg-[#00c3a9]' : 'bg-muted')}
            />
            <span
              className={cn(
                'text-base leading-none',
                isReached ? 'text-foreground' : 'text-muted-foreground',
                isActive && 'font-bold',
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export { Stepper };
