import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ColorInput } from '@/components/ui/color-input';
import { Label } from '@/components/ui/label';
import { useSaveSettings } from './useSaveSettings';

export interface ThemeColors {
  colorPrimary: string;
  colorPrimaryHover: string;
  colorAccent: string;
  colorAccentHover: string;
  colorSecondary: string;
}

const FIELDS: { name: keyof ThemeColors; label: string; description?: string }[] = [
  { name: 'colorPrimary', label: 'Primary' },
  { name: 'colorPrimaryHover', label: 'Primary hover' },
  { name: 'colorAccent', label: 'Accent' },
  { name: 'colorAccentHover', label: 'Accent hover' },
  {
    name: 'colorSecondary',
    label: 'Secondary',
    description: 'Optional. Leave empty to use a lighter primary colour.',
  },
];

interface IProps {
  colors: ThemeColors;
}

export function ThemeSettingsPage({ colors }: IProps) {
  const [form, setForm] = useState(colors);
  const { save, submitting } = useSaveSettings();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    save(form);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Colour theme</h1>

      <p className="text-sm text-muted-foreground">Hex colours, like #fee77b.</p>

      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
        {FIELDS.map(({ name, label, description }) => (
          <div key={name} className="flex flex-col gap-2">
            <Label htmlFor={`settings-${name}`}>{label}</Label>
            <ColorInput
              id={`settings-${name}`}
              value={form[name]}
              placeholder={name === 'colorSecondary' ? '#fff0b4' : undefined}
              required={name !== 'colorSecondary'}
              onChange={(value) => setForm((f) => ({ ...f, [name]: value }))}
            />
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        ))}

        <div>
          <Button type="submit" disabled={submitting}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
