import { FieldInput } from 'oa-components';
import { Field } from 'react-final-form';
import { contact } from 'src/pages/User/labels';
import { Box, Label } from 'theme-ui';

export const UserContactFieldName = () => {
  const { title, placeholder } = contact.name;
  const name = 'name';

  return (
    <Box>
      <Label htmlFor={name}>{title}</Label>
      <Field
        component={FieldInput}
        data-cy={name}
        data-testid={name}
        name={name}
        placeholder={placeholder}
        sx={{ backgroundColor: 'white' }}
        validateFields={[]}
      />
    </Box>
  );
};
