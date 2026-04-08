import { Select } from 'oa-components';
import { NewsContentReachOptionList } from 'oa-shared';
import { Field } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { FormFieldWrapper } from './FormFieldWrapper';
import { contentReach } from './labels';

interface IProps {
  placeholder: string;
  title: string;
}

export const ContentReachField = ({ placeholder, title }: IProps) => {
  const name = 'contentReach';

  const NewsContentReachOptions = NewsContentReachOptionList.map((option) => ({
    value: option,
    label: contentReach[option],
  }));

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
              options={NewsContentReachOptions || []}
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
