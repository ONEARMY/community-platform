import { Select } from 'oa-components';
import type { SelectValue } from 'oa-shared';
import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { ProfileBadgeService } from 'src/services/profileBadgeService';
import { FormFieldWrapper } from './FormFieldWrapper';

interface IProps {
  description: string;
  placeholder: string;
  title: string;
  showPublicBadge?: boolean;
}

export const ProfileBadgeField = ({ description, placeholder, title, showPublicBadge }: IProps) => {
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
      setProfileBadges([
        ...(showPublicBadge ? [{ value: null, label: 'Public' }] : []),
        ...selectBadges,
      ]);
    };

    initCategories();
  }, []);

  return (
    <FormFieldWrapper description={description} htmlFor={name} text={title}>
      <Field
        name={name}
        id={name}
        render={({ input, ...rest }) => {
          const publicOption = { value: null, label: 'Public' };

          const selectedOption =
            profileBadges.find((o) => o.value === (input.value?.value ?? input.value)) ??
            (showPublicBadge ? publicOption : null);

          return (
            <FieldContainer data-cy={`${name}-select`}>
              <Select
                {...rest}
                variant="form"
                inputId="profileBadge"
                options={profileBadges || []}
                value={selectedOption}
                onChange={(changedValue) => {
                  input.onChange(changedValue ?? null);
                }}
                getOptionValue={(option) => option.value ?? '__public__'}
                isClearable={true}
                placeholder={placeholder}
              />
            </FieldContainer>
          );
        }}
      />
    </FormFieldWrapper>
  );
};
