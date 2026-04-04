import { FieldTextarea } from 'oa-components';
import { Field } from 'react-final-form';
import { MESSAGE_MAX_CHARACTERS, MESSAGE_MIN_CHARACTERS } from 'src/pages/User/constants';
import { contact } from 'src/pages/User/labels';
import { required } from 'src/utils/validators';
import { Flex, Label } from 'theme-ui';

export const UserContactFieldMessage = () => {
  const name = 'message';

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      <Label htmlFor={name}>{`${contact.message.title} *`}</Label>
      <Field
        name={name}
        placeholder={contact.message.placeholder}
        minLength={MESSAGE_MIN_CHARACTERS}
        maxLength={MESSAGE_MAX_CHARACTERS}
        data-cy={name}
        data-testid={name}
        modifiers={{ capitalize: true, trim: true }}
        component={FieldTextarea}
        sx={{ backgroundColor: 'white' }}
        validate={required}
        validateFields={[]}
        showCharacterCount
      />
    </Flex>
  );
};
