import { Field } from 'react-final-form';
import { FieldInput } from 'oa-components';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { NEWS_MAX_TITLE_LENGTH, NEWS_MIN_TITLE_LENGTH } from 'src/pages/News/constants';

interface IProps {
  placeholder?: string;
  validate: (value: any) => Promise<any>;
  title: string;
}

export const TitleField = ({ placeholder, title, validate }: IProps) => {
  const name = 'title';

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        data-cy={`field-${name}`}
        name={name}
        id={name}
        validate={validate}
        component={FieldInput}
        placeholder={placeholder}
        minLength={NEWS_MIN_TITLE_LENGTH}
        maxLength={NEWS_MAX_TITLE_LENGTH}
        showCharacterCount
        onBlur
      />
    </FormFieldWrapper>
  );
};
