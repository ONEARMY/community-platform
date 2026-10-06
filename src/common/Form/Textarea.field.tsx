import { CharacterCount } from '@/components/ui/character-count';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import type { FieldProps } from './types';

interface Props extends FieldProps {
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const TextareaField = ({
  input,
  meta,
  className,
  showCharacterCount,
  maxLength,
  ...rest
}: Props) => {
  const showError = meta.error && meta.touched;
  const currentLength = input.value?.length ?? 0;

  return (
    <div className="flex flex-col gap-1">
      {showError && <p className="text-sm text-destructive">{meta.error}</p>}
      <Textarea
        {...input}
        {...rest}
        maxLength={maxLength}
        aria-invalid={showError}
        className={cn(className)}
      />
      {showCharacterCount && maxLength && (
        <CharacterCount current={currentLength} max={maxLength} />
      )}
    </div>
  );
};
