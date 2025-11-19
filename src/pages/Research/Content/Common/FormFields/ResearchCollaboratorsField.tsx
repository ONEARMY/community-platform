import { Field } from 'react-final-form';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { UserNameSelect } from 'src/pages/common/UserNameSelect/UserNameSelect';
import { overview } from 'src/pages/Research/labels';

export const ResearchCollaboratorsField = () => {
  const name = 'collaborators';
  const { placeholder, title } = overview.collaborators;

  return (
    <FormFieldWrapper htmlFor={name} text={title}>
      <Field name={name} component={UserNameSelect} placeholder={placeholder} defaultOptions={[]} />
    </FormFieldWrapper>
  );
};
