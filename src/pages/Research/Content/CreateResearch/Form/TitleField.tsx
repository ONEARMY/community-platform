import { FieldInput } from 'oa-components';
import { Field } from 'react-final-form';
import { COMPARISONS } from 'src/utils/comparisons';
import { composeValidators, minValue, required } from 'src/utils/validators';
import { Flex, Label } from 'theme-ui';

import { RESEARCH_TITLE_MAX_LENGTH, RESEARCH_TITLE_MIN_LENGTH } from '../../../constants';
import { updateForm as updateLabels } from '../../../labels';

export const TitleField = () => {
  const { title, placeholder } = updateLabels.title;

  return (
    <Flex sx={{ flexDirection: 'column' }} mb={3}>
      <Label htmlFor="title" sx={{ mb: 2 }}>
        {title}
      </Label>
      <Field
        id="title"
        name="title"
        data-cy="intro-title"
        validateFields={[]}
        validate={composeValidators(required, minValue(RESEARCH_TITLE_MIN_LENGTH))}
        isEqual={COMPARISONS.textInput}
        component={FieldInput}
        maxLength={RESEARCH_TITLE_MAX_LENGTH}
        minLength={RESEARCH_TITLE_MIN_LENGTH}
        showCharacterCount
        placeholder={placeholder}
      />
    </Flex>
  );
};
