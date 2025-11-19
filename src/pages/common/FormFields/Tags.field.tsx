import { Field } from 'react-final-form';
import { TagsSelectField } from 'src/common/Form/TagsSelectField';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { COMPARISONS } from 'src/utils/comparisons';

interface IProps {
  title: string;
}

export const TagsField = ({ title }: IProps) => {
  const name = 'tags';

  return (
    <FormFieldWrapper htmlFor={name} text={title}>
      <Field
        data-cy={`field-${name}`}
        name={name}
        id={name}
        component={TagsSelectField}
        isEqual={COMPARISONS.tagsSupabase}
      />
    </FormFieldWrapper>
  );
};
