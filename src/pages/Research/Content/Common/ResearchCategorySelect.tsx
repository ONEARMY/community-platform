import type { Category } from 'oa-shared';
import { useEffect, useMemo, useState } from 'react';
import { Field } from 'react-final-form';
import type { CardSelectOption } from 'src/pages/common/CardsSelect/CardsSelect';
import { CardsSelect } from 'src/pages/common/CardsSelect/CardsSelect';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { categoryService } from 'src/services/categoryService';
import { required } from 'src/utils/validators';
import { Box, Text } from 'theme-ui';
import { researchForm } from '../../labels';

const ResearchFieldCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const name = 'category';

  const options = useMemo<CardSelectOption[]>(
    () =>
      categories.map((x) => ({
        value: x.id.toString(),
        label: x.name,
        image: x.imageUrl ?? undefined,
        paragraph: x.description ?? '',
      })),
    [categories],
  );

  useEffect(() => {
    const getCategories = async () => {
      const categories = await categoryService.getCategories('research');
      if (categories) {
        setCategories(categories);
      }
    };

    getCategories();
  }, []);

  return (
    <FormFieldWrapper htmlFor={name} text={researchForm.categories.title} required>
      <Field
        name={name}
        validate={required}
        render={({ input, meta }) => (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {meta.touched && meta.error && (
              <Text sx={{ color: 'error', fontSize: 1 }}>{meta.error}</Text>
            )}
            <CardsSelect
              data-cy="category-select"
              options={options}
              error={meta.touched && !!meta.error}
              selectedValue={input.value?.value}
              onChange={(value) => {
                const category = categories.find((x) => x.id.toString() === value);
                input.onChange(category ? { label: category.name, value } : '');
              }}
            />
          </Box>
        )}
      />
    </FormFieldWrapper>
  );
};

export default ResearchFieldCategory;
