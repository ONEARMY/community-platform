import { FieldTextarea } from 'oa-components';
import { Field } from 'react-final-form';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { RESEARCH_MAX_LENGTH } from 'src/pages/Research/constants';
import { researchForm } from 'src/pages/Research/labels';
import { COMPARISONS } from 'src/utils/comparisons';
import { draftValidationWrapper, required } from 'src/utils/validators';

export const ResearchDescriptionField = () => {
  const name = 'description';
  const { placeholder, title } = researchForm.description;

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        id={name}
        name={name}
        data-cy="intro-description"
        validate={(value, allValues) => draftValidationWrapper(value, allValues, required)}
        isEqual={COMPARISONS.textInput}
        component={FieldTextarea}
        rows={10}
        maxLength={RESEARCH_MAX_LENGTH}
        showCharacterCount
        placeholder={placeholder}
      />
    </FormFieldWrapper>
  );
};
