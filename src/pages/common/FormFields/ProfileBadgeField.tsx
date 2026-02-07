import { Select } from 'oa-components';
import type { SelectValue } from 'oa-shared';
import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { ProfileBadgeService } from 'src/services/profileBadgeService';
import { FormFieldWrapper } from './FormFieldWrapper';

interface IProps {
  placeholder: string;
  title: string;
}

export const ProfileBadgeField = ({ placeholder, title }: IProps) => {
  const [profileBadges, setProfileBadges] = useState<SelectValue[]>([]);
  const name = 'profileBadge';

  useEffect(() => {
    const initCategories = async () => {
      const badges = await ProfileBadgeService.getProfileBadges();
      if (!badges) {
        return;
      }

      const selectBadges = badges.map((badge) => ({
        value: badge.id.toString(),
        label: badge.displayName,
      }));
      setProfileBadges(selectBadges);
    };

    initCategories();
  }, []);

  return (
    <FormFieldWrapper htmlFor={name} text={title}>
      <Field
        name={name}
        id={name}
        isEqual={(a, b) => !!a && a?.value === b?.value}
        render={({ input, ...rest }) => (
          <FieldContainer data-cy="profileBadge-select">
            <Select
              {...rest}
              variant="form"
              options={profileBadges || []}
              value={input.value}
              onChange={(changedValue) => {
                input.onChange(changedValue ?? null);
              }}
              isClearable={true}
              placeholder={placeholder}
            />
          </FieldContainer>
        )}
      />
    </FormFieldWrapper>
  );
};
