import { Select } from 'oa-components';
import type { SelectValue } from 'oa-shared';
import { FieldContainer } from '../../../common/Form/FieldContainer';

export type CategoriesSelectProps = {
  value: SelectValue | null;
  placeholder: string;
  isForm: boolean;
  categories: SelectValue[];
  onChange: (value: SelectValue) => void;
  invalid?: boolean;
};

const getVariant = (isForm: boolean, invalid: boolean) => {
  if (!isForm) return undefined;
  return invalid ? 'formError' : 'form';
};

export const CategoriesSelectV2 = ({
  value,
  placeholder,
  isForm,
  categories,
  onChange,
  invalid = false,
}: CategoriesSelectProps) => {
  const handleChange = (changedValue) => {
    onChange(changedValue ?? null);
  };

  return (
    <FieldContainer
      invalid={invalid}
      data-cy={categories ? 'category-select' : 'category-select-empty'}
    >
      <Select
        variant={getVariant(isForm, invalid)}
        options={categories}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        isClearable={true}
      />
    </FieldContainer>
  );
};
