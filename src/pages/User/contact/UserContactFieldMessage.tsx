import { Field } from 'react-final-form';
import { TextareaField } from 'src/common/Form/Textarea.field';
import type { FieldProps } from 'src/common/Form/types';
import { MESSAGE_MAX_CHARACTERS, MESSAGE_MIN_CHARACTERS } from 'src/pages/User/constants';
import { contact } from 'src/pages/User/labels';
import { minValue, required } from 'src/utils/validators';

const MessageField = ({ meta, ...props }: FieldProps) => (
  <TextareaField
    {...props}
    meta={{ ...meta, touched: meta.touched && (meta.dirty || meta.submitFailed) }}
  />
);

export const UserContactFieldMessage = () => (
  <Field
    name="message"
    aria-label={contact.message.title}
    placeholder={contact.message.placeholder}
    minLength={MESSAGE_MIN_CHARACTERS}
    maxLength={MESSAGE_MAX_CHARACTERS}
    data-cy="message"
    data-testid="message"
    rows={5}
    format={(value: string) => value && value.trim()}
    formatOnBlur
    component={MessageField}
    validate={(value) => required(value) || minValue(MESSAGE_MIN_CHARACTERS)(value)}
    validateFields={[]}
    showCharacterCount
  />
);
