import { Field } from 'react-final-form';
import { FieldMarkdown } from 'oa-components';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { fields } from 'src/pages/News/labels';
import { required } from 'src/utils/validators';

interface IProps {
  imageUpload: (image: File) => Promise<string>;
}

export const NewsBodyField = ({ imageUpload }: IProps) => {
  const name = 'body';

  return (
    <FormFieldWrapper htmlFor={name} text={fields.body.title} required>
      <Field
        data-cy={`field-${name}`}
        component={FieldMarkdown}
        id={name}
        imageUploadHandler={imageUpload}
        name={name}
        placeholder={fields.body.placeholder}
        validate={required}
      />
    </FormFieldWrapper>
  );
};
