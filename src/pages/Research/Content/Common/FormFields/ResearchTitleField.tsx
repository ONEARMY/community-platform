import { FieldInput } from 'oa-components';
import { Field } from 'react-final-form';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { RESEARCH_TITLE_MAX_LENGTH, RESEARCH_TITLE_MIN_LENGTH } from 'src/pages/Research/constants';
import { overview } from 'src/pages/Research/labels';
import { COMPARISONS } from 'src/utils/comparisons';
import { composeValidators, minValue, required, validateTitle } from 'src/utils/validators';

export const ResearchTitleField = () => {
  const name = 'title';
  const { placeholder, title } = overview.title;

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        id={name}
        name={name}
        data-cy="intro-title"
        validateFields={[]}
        validate={composeValidators(required, minValue(RESEARCH_TITLE_MIN_LENGTH), validateTitle())}
        isEqual={COMPARISONS.textInput}
        component={FieldInput}
        maxLength={RESEARCH_TITLE_MAX_LENGTH}
        minLength={RESEARCH_TITLE_MIN_LENGTH}
        showCharacterCount
        placeholder={placeholder}
      />
    </FormFieldWrapper>
  );
};
