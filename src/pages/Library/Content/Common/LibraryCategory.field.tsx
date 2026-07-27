import type { Category } from 'oa-shared';
import { useEffect, useMemo, useState } from 'react';
import { Field } from 'react-final-form';
import type { CardSelectOption } from 'src/pages/common/CardsSelect/CardsSelect';
import { CardsSelect } from 'src/pages/common/CardsSelect/CardsSelect';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { intro } from 'src/pages/Library/labels';
import { categoryService } from 'src/services/categoryService';
import { required } from 'src/utils/validators';
import { Box, Text } from 'theme-ui';
import { LibraryCategoryGuidance } from './LibraryCategoryGuidance';

export const LibraryCategoryField = () => {
  const { title } = intro.category;

  const [categories, setCategories] = useState<Category[]>([]);
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
      const categories = await categoryService.getCategories('projects');

      if (categories) {
        setCategories(categories);
      }
    };

    getCategories();
  }, []);

  return (
    <FormFieldWrapper text={title} required>
      <Field
        name="category"
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
            {input?.value?.value && (
              <LibraryCategoryGuidance
                category={categories.find((x) => x.id === Number(input.value.value))}
                type="main"
              />
            )}
          </Box>
        )}
      />
    </FormFieldWrapper>
  );
};
