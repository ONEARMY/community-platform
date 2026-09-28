import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Borders live on the items, not the group, so an item matches the equivalent
// Button's height exactly. `-ml-hairline` collapses each shared edge to one border.
const toggleGroupItemVariants = cva(
  "relative -ml-hairline inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-none border-2 bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none first:ml-0 first:rounded-l-lg last:rounded-r-lg focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-pressed:bg-accent data-pressed:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'border-outline bg-background hover:bg-muted hover:text-foreground',
        outline: 'border-border bg-background hover:bg-muted hover:text-foreground',
        ghost: 'border-transparent hover:bg-muted hover:text-foreground',
      },
      size: {
        xs: "h-6 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 px-2.5 text-control-sm [&_svg:not([class*='size-'])]:size-3.5",
        default: 'h-8 px-2.5 text-sm',
        lg: 'h-9 px-2.5 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleGroupItemVariants>>({
  variant: 'default',
  size: 'default',
});

function ToggleGroup<Value extends string>({
  className,
  variant,
  size,
  children,
  ...props
}: ToggleGroupPrimitive.Props<Value> & VariantProps<typeof toggleGroupItemVariants>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn('inline-flex w-fit items-center', className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem<Value extends string>({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props<Value> & VariantProps<typeof toggleGroupItemVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(
        toggleGroupItemVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
          className,
        }),
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem, toggleGroupItemVariants };
