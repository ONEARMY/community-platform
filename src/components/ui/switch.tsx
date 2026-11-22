import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { cn } from '@/lib/utils';

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-muted-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:bg-green data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-3 rounded-full bg-background shadow-sm transition-transform data-checked:translate-x-3"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
