import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const SupporterCTA = ({
  onClick,
  disabled,
  children,
  color,
  type = 'button',
  dataCy,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  color: string;
  type?: 'button' | 'submit';
  dataCy?: string;
}) => (
  <button
    type={type}
    disabled={disabled}
    data-cy={dataCy}
    onClick={onClick}
    style={{ '--supporter-cta-color': color } as CSSProperties}
    className={cn(
      'inline-flex h-13 w-full items-center justify-center gap-2 rounded-s border-none bg-supporter-cta font-medium text-base text-black transition-colors duration-150 sm:text-xl',
      disabled
        ? 'cursor-not-allowed opacity-60'
        : 'cursor-pointer hover:bg-outline hover:text-white',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
    )}
  >
    {children}
  </button>
);
