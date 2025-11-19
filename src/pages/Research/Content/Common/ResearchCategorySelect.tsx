import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { CategoriesSelectV2 } from 'src/pages/common/Category/CategoriesSelectV2';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { categoryService } from 'src/services/categoryService';

import { overview } from '../../labels';

import type { SelectValue } from 'oa-shared';

const ResearchFieldCategory = () => {
  const [options, setOptions] = useState<SelectValue[]>([]);
  const name = 'category';

  useEffect(() => {
    const getCategories = async () => {
      const categories = await categoryService.getCategories('research');
      setOptions(
        categories.map(({ id, name }) => ({
          value: id.toString(),
          label: name,
        })),
      );
    };

    getCategories();
  }, []);

  return (
    <FormFieldWrapper htmlFor={name} text={overview.categories.title}>
      <Field
        name={name}
        render={({ input }) => (
          <CategoriesSelectV2
            isForm={true}
            onChange={(category) => input.onChange(category)}
            value={input.value}
            placeholder={overview.categories.placeholder || ''}
            categories={options}
          />
        )}
      />
    </FormFieldWrapper>
  );
};

export default ResearchFieldCategory;
