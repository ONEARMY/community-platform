import oneArmyLogo from '@/assets/icons/icon-star-active.svg';
import { cn } from '@/lib/utils';

type SiteFooterProps = React.ComponentProps<'footer'> & {
  siteName: string;
};

function SiteFooter({ className, siteName, ...props }: SiteFooterProps) {
  return (
    <footer
      data-slot="site-footer"
      className={cn(
        'relative mt-9 flex flex-col items-center bg-[#27272c] px-5 py-9 text-center text-white',
        // right padding keeps the text clear of the fixed StickyButton
        'min-[52rem]:items-start min-[52rem]:py-7 min-[52rem]:pr-62 min-[52rem]:pl-13 min-[52rem]:text-left',
        'min-[70rem]:flex-row min-[70rem]:items-center min-[70rem]:py-9 min-[70rem]:pl-5',
        className,
      )}
      {...props}
    >
      <img
        src={oneArmyLogo}
        alt=""
        className="mb-3 w-4 min-[52rem]:absolute min-[52rem]:top-9 min-[52rem]:left-6 min-[52rem]:mb-0 min-[70rem]:static"
      />
      <p className="mr-1 min-[70rem]:ml-3">
        {siteName} is a project by <FooterLink href="https://onearmy.earth/">One Army</FooterLink>.
      </p>
      <p className="mt-2 min-[52rem]:mt-0">
        Help us build the <FooterLink href="https://platform.onearmy.earth/">software</FooterLink>.
      </p>
    </footer>
  );
}

function FooterLink({ className, ...props }: React.ComponentProps<'a'>) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn('whitespace-nowrap text-white underline', className)}
      {...props}
    />
  );
}

export { SiteFooter };
