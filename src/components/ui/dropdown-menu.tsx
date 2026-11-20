import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const DropdownMenu = MenuPrimitive.Root;

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  className,
  align = 'end',
  side = 'bottom',
  sideOffset = 4,
  container,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'align' | 'side' | 'sideOffset'> &
  Pick<MenuPrimitive.Portal.Props, 'container'>) {
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner align={align} side={side} sideOffset={sideOffset} className="z-50">
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            'min-w-40 overflow-hidden rounded-card-flat border-2 border-outline bg-popover text-popover-foreground outline-none',
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

const dropdownMenuItemVariants = cva(
  'flex min-h-9 w-full cursor-pointer items-center gap-2 px-3 py-2 font-heading font-normal whitespace-nowrap outline-none select-none data-highlighted:bg-softblue data-disabled:pointer-events-none data-disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
);

function DropdownMenuItem({
  className,
  size = 'sm',
  ...props
}: MenuPrimitive.Item.Props & VariantProps<typeof dropdownMenuItemVariants>) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(dropdownMenuItemVariants({ size, className }))}
      {...props}
    />
  );
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger };
