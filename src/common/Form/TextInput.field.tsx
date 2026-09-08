import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import type { FieldProps } from './types';

export const TextInputField = ({ input, meta, className, ...rest }: FieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = input.type === 'password';
  const showError = Boolean(meta.error && meta.touched);

  return (
    <div className="flex flex-col gap-1">
      {showError && <p className="text-sm text-destructive">{meta.error}</p>}
      <div className="relative flex items-center">
        <Input
          {...input}
          {...rest}
          type={isPassword ? (isPasswordVisible ? 'text' : 'password') : input.type}
          aria-invalid={showError}
          className={cn(isPassword && 'pr-8', className)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            className="absolute right-2.5 text-muted-foreground hover:text-foreground"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
