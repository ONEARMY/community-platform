import type { Category, ContentType } from 'oa-shared';
import { useEffect, useMemo, useState } from 'react';
import { Field } from 'react-final-form';
import type { CardSelectOption } from 'src/pages/common/CardsSelect/CardsSelect';
import { CardsSelect } from 'src/pages/common/CardsSelect/CardsSelect';
import { fields } from 'src/pages/Question/labels';
import { categoryService } from 'src/services/categoryService';
import { required as requiredValidator } from 'src/utils/validators';
import { Box, Text } from 'theme-ui';
import { FormFieldWrapper } from './FormFieldWrapper';

interface IProps {
  type: ContentType;
  required?: boolean;
}

export const CategoryField = ({ type, required = false }: IProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const name = 'category';

  const options = useMemo<CardSelectOption[]>(
    () =>
      categories.map((category) => ({
        value: category.id.toString(),
        label: category.name,
        image: category.imageUrl ?? undefined,
        paragraph: category.description ?? '',
      })),
    [categories],
  );

  useEffect(() => {
    const initCategories = async () => {
      const categories = await categoryService.getCategories(type);
      if (categories) {
        setCategories(categories);
      }
    };

    initCategories();
  }, []);

  return (
    <FormFieldWrapper htmlFor={name} text={fields.category.title} required={required}>
      <Field
        name={name}
        id={name}
        validate={required ? requiredValidator : undefined}
        isEqual={(a, b) => {
          if (!a && !b) return true; // both null/undefined = equal
          return !!a && a?.value === b?.value;
        }}
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
