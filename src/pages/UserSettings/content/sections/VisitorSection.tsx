import { Select, visitorDisplayData } from 'oa-components';
import type { Profile, UserVisitorPreferencePolicy } from 'oa-shared';
import { userVisitorPreferencePolicies } from 'oa-shared';
import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { TextareaField } from 'src/common/Form/Textarea.field';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { fields, headings } from '../../labels';
import { SettingsField, SettingsSubheading } from '../elements';

interface Props {
  visitorPolicy?: Partial<Profile['visitorPolicy']>;
}

const visitorPolicyOptions = userVisitorPreferencePolicies.map((policy) => ({
  value: policy,
  label: visitorDisplayData.get(policy)?.label || policy,
}));

function findPolicy(policyValue: UserVisitorPreferencePolicy) {
  return visitorPolicyOptions.find(({ value }) => value === policyValue);
}

const { title: preferenceTitle, description: preferenceDescription } = fields.visitorPreference;
const { title: policyTitle } = fields.visitorPolicy;
const { title: policyDetailsTitle, placeholder: policyDetailsPlaceholder } = fields.visitorDetails;

export const VisitorSection = ({ visitorPolicy }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(!!visitorPolicy);
  }, [visitorPolicy]);

  return (
    <div data-testid="VisitorSection" data-cy="VisitorSection" className="flex flex-col gap-2">
      <SettingsSubheading>{headings.visitors}</SettingsSubheading>
      <p className="text-sm text-muted-foreground">{preferenceDescription}</p>
      <Field name="showVisitorPolicy">
        {({ input }) => (
          <Label size="base" weight="normal">
            <Switch
              checked={isOpen}
              data-testid="openToVisitors-switch"
              onCheckedChange={() =>
                input.onChange(isOpen ? null : visitorPolicy || { policy: 'open' })
              }
            />
            {preferenceTitle}
          </Label>
        )}
      </Field>
      {visitorPolicy && (
        <div className="mt-3 flex flex-col gap-5">
          <SettingsField label={policyTitle} required>
            <FieldContainer data-cy="openToVisitors-policy">
              <Field name="visitorPreferencePolicy">
                {({ input }) => (
                  <Select
                    options={visitorPolicyOptions}
                    defaultValue={findPolicy(visitorPolicy.policy || 'open')}
                    onChange={({ value }) => input.onChange(value)}
                  />
                )}
              </Field>
            </FieldContainer>
          </SettingsField>
          <SettingsField label={policyDetailsTitle} htmlFor="visitorPreferenceDetails">
            <Field
              id="visitorPreferenceDetails"
              name="visitorPreferenceDetails"
              data-cy="openToVisitors-details"
              component={TextareaField}
              variant="filled"
              placeholder={policyDetailsPlaceholder}
            />
          </SettingsField>
        </div>
      )}
    </div>
  );
};
