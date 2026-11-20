import type * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from './input';

const HEX = /^#[0-9a-f]{6}$/i;
const SHORT_HEX = /^#[0-9a-f]{3}$/i;

const toPickerValue = (value: string) => {
  if (HEX.test(value)) {
    return value;
  }
  if (SHORT_HEX.test(value)) {
    return `#${[...value.slice(1)].map((c) => c + c).join('')}`;
  }
  return '#000000';
};

interface ColorInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'> {
  value: string;
  onChange: (value: string) => void;
}

function ColorInput({ value, onChange, className, placeholder, ...props }: ColorInputProps) {
  return (
    <div data-slot="color-input" className={cn('flex items-center gap-2', className)}>
      <input
        type="color"
        aria-label="Pick a colour"
        value={toPickerValue(value || placeholder || '')}
        onChange={(event) => onChange(event.target.value)}
        disabled={props.disabled}
        className="color-swatch size-8 shrink-0 cursor-pointer rounded-sm border border-input bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </div>
  );
}

export { ColorInput };
