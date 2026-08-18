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
      'inline-flex h-13 w-full items-center justify-center gap-[10px] rounded-[5px] border-none bg-[var(--supporter-cta-color)] font-medium text-[17px] text-black transition-colors duration-150 sm:text-[22px]',
      disabled
        ? 'cursor-not-allowed opacity-60'
        : 'cursor-pointer hover:bg-[#1b1b1b] hover:text-white',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
    )}
  >
    {children}
  </button>
);
