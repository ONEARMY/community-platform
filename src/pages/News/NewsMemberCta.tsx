import { Link } from 'react-router';
import { trackEvent } from 'src/common/Analytics';
import { buttonVariants } from '@/components/ui/button';

export interface NewsCta {
  title: string | null;
  body: string | null;
  imageUrl: string | null;
  actionLabel: string | null;
  actionUrl: string | null;
}

interface IProps {
  cta: NewsCta;
}

export const NewsMemberCta = ({ cta }: IProps) => (
  <div
    data-cy="news-member-cta"
    className="sticky bottom-16 mt-auto -mb-9 z-50 full-bleed-primary-soft text-foreground desktop-nav:bottom-0"
  >
    <div className="mx-auto flex max-w-100 flex-col items-center gap-3 p-4 text-center">
      <div className="flex flex-col gap-1 items-center">
        <h2 className="font-heading text-2xl">{cta.title}</h2>
        {cta.imageUrl && <img src={cta.imageUrl} alt="" className="size-20 object-contain" />}
        {cta.body && <p className="text-lg whitespace-pre-line">{cta.body}</p>}
      </div>
      {cta.actionUrl && cta.actionLabel && (
        <Link
          to={cta.actionUrl}
          className={buttonVariants({
            variant: 'brand-secondary',
            size: 'lg',
            className: 'w-full',
          })}
          onClick={() =>
            trackEvent({
              action: 'clickSupport',
              category: 'news',
              label: cta.actionLabel ?? undefined,
            })
          }
        >
          {cta.actionLabel}
        </Link>
      )}
    </div>
  </div>
);
