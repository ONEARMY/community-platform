import { Field } from 'react-final-form';
import { fields } from 'src/pages/UserSettings/labels';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SettingsSubheading } from '../elements';

type PublicContactSectionProps = {
  isContactable: boolean;
};

export const PublicContactSection = ({ isContactable }: PublicContactSectionProps) => {
  const { description, placeholder, title } = fields.publicContentPreference;
  const name = 'isContactable';

  return (
    <div
      id="public-contact"
      data-testid="PublicContactSection"
      data-cy="PublicContactSection"
      className="flex flex-col gap-2"
    >
      <SettingsSubheading>{title}</SettingsSubheading>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Field name={name}>
        {({ input }) => (
          <Label size="base" weight="normal">
            <Switch
              checked={isContactable}
              data-cy={`${name}-${isContactable}`}
              data-testid={name}
              onCheckedChange={(checked) => input.onChange(checked)}
            />
            {placeholder}
          </Label>
        )}
      </Field>
    </div>
  );
};
