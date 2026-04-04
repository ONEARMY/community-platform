import { FieldInput } from 'oa-components';
import { Field } from 'react-final-form';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { COMPARISONS } from 'src/utils/comparisons';
import { composeValidators, minValue, required } from 'src/utils/validators';
import { LIBRARY_TITLE_MAX_LENGTH, LIBRARY_TITLE_MIN_LENGTH } from '../../constants';
import { intro } from '../../labels';

export const LibraryTitleField = () => {
  const name = 'title';

  return (
    <FormFieldWrapper htmlFor={name} text={intro.title.title} required>
      <Field
        id={name}
        name={name}
        data-cy="intro-title"
        validateFields={[]}
        validate={composeValidators(required, minValue(LIBRARY_TITLE_MIN_LENGTH))}
        isEqual={COMPARISONS.textInput}
        modifiers={{ capitalize: true, trim: true }}
        component={FieldInput}
        minLength={LIBRARY_TITLE_MIN_LENGTH}
        maxLength={LIBRARY_TITLE_MAX_LENGTH}
        placeholder={intro.title.placeholder}
        showCharacterCount={true}
      />
    </FormFieldWrapper>
  );
};
