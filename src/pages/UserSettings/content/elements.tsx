import type { ReactNode } from 'react';

interface SettingsFieldProps {
  label: string;
  description?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  'data-testid'?: string;
}

export const SettingsField = ({
  label,
  description,
  required,
  htmlFor,
  children,
  'data-testid': testId,
}: SettingsFieldProps) => (
  <div data-testid={testId} className="flex flex-col gap-1.5">
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="font-heading text-base">
        {label}
        {required && ' *'}
      </label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    {children}
  </div>
);

export const SettingsCardHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="font-heading text-2xl sm:text-3xl">{children}</h2>
);

export const SettingsSubheading = ({ children }: { children: ReactNode }) => (
  <h3 className="font-heading text-xl">{children}</h3>
);
