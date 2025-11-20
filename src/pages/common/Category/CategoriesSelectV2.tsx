import { Select } from 'oa-components';

import { FieldContainer } from '../../../common/Form/FieldContainer';

import type { SelectValue } from 'oa-shared';

export type CategoriesSelectProps = {
  value: SelectValue | null;
  placeholder: string;
  isForm: boolean;
  categories: SelectValue[];
  onChange: (value: SelectValue) => void;
};

export const CategoriesSelectV2 = ({
  value,
  placeholder,
  isForm,
  categories,
  onChange,
}: CategoriesSelectProps) => {
  const handleChange = (changedValue) => {
    onChange(changedValue ?? null);
  };

  return (
    <FieldContainer data-cy={categories ? 'category-select' : 'category-select-empty'}>
      <Select
        variant={isForm ? 'form' : undefined}
        options={categories}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        isClearable={true}
      />
    </FieldContainer>
  );
};
