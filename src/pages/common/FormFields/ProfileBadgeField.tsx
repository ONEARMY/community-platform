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
  const name = 'profileBadges';

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
          // Normalize stored value to always be an array of value strings
          const storedValues: (string | null)[] = Array.isArray(input.value)
            ? input.value.map((v: any) => v?.value ?? v)
            : input.value
              ? [typeof input.value === 'object' ? input.value.value : input.value]
              : showPublicBadge
                ? [null]
                : [];

          // Map stored values to current option objects
          const selectedOptions = storedValues
            .map((val) => profileBadges.find((o) => o.value === val))
            .filter(Boolean);

          const handleChange = (selected: any[]) => {
            if (!selected?.length) {
              // Store null for public, or empty array
              input.onChange(showPublicBadge ? [null] : []);
              return;
            }

            const lastSelected = selected[selected.length - 1];
            const isLastPublic = lastSelected.value === null;

            if (isLastPublic) {
              // Public was just added — store only null
              input.onChange([null]);
            } else {
              // Store only the value strings, excluding public
              const values = selected.filter((o) => o.value !== null).map((o) => o.value);
              input.onChange(values);
            }
          };

          return (
            <FieldContainer data-cy={`${name}-select`}>
              <Select
                {...rest}
                variant="form"
                inputId="profileBadges"
                options={profileBadges || []}
                value={selectedOptions}
                onChange={handleChange}
                isMulti={true}
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
