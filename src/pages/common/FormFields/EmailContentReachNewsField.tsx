import { Select } from 'oa-components';
import { EmailContentReach, SelectValue } from 'oa-shared';
import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { emailContentReachService } from 'src/services/emailContentReachService';
import { FormFieldWrapper } from './FormFieldWrapper';

interface IProps {
  placeholder: string;
  title: string;
}

export const EmailContentReachNewsField = ({ placeholder, title }: IProps) => {
  const [options, setOptions] = useState<SelectValue[]>([]);
  const name = 'emailContentReach';

  useEffect(() => {
    const fetchEmailContentReach = async () => {
      const emailContentReach = await emailContentReachService.getAll();
      if (emailContentReach) {
        const fieldOptions = emailContentReach.map((reach) => {
          return EmailContentReach.toCreateCreateFormField(reach);
        });
        setOptions(fieldOptions);
      }
    };
    fetchEmailContentReach();
  }, []);

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        name={name}
        id={name}
        isEqual={(a, b) => !!a && a?.value === b?.value}
        render={({ input, ...rest }) => (
          <FieldContainer data-cy={`${name}-select`}>
            <Select
              {...rest}
              variant="form"
              options={options || []}
              value={input.value}
              onChange={(changedValue) => {
                input.onChange(changedValue ?? null);
              }}
              placeholder={placeholder}
            />
          </FieldContainer>
        )}
      />
    </FormFieldWrapper>
  );
};
