import { Select } from 'oa-components';
import { contentReachSettings, SelectValue } from 'oa-shared';
import { Field } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { FormFieldWrapper } from './FormFieldWrapper';

interface IProps {
  placeholder: string;
  title: string;
  shouldDisableContentReach: boolean;
}

export const ContentReachField = (props: IProps) => {
  const { placeholder, title, shouldDisableContentReach } = props;
  const name = 'contentReach';

  const description = shouldDisableContentReach
    ? 'This field is disabled as the news has already been published'
    : undefined;

  const contentReachOptions: SelectValue[] = contentReachSettings.map((option) => ({
    value: option.value?.toString() || null,
    label: option.contentLabel,
  }));

  return (
    <FormFieldWrapper htmlFor={name} text={title} description={description} required>
      <Field
        name={name}
        id={name}
        render={({ input, ...rest }) => {
          // Find matching option by value, defaulting to 'No Email' if no value set
          const value = contentReachOptions.find(
            (o) => o.value === input.value || o.value === null,
          );

          return (
            <FieldContainer data-cy={`${name}-select`}>
              <Select
                {...rest}
                inputId="contentReach"
                variant="form"
                options={contentReachOptions || []}
                value={value}
                onChange={(changedValue) => {
                  input.onChange(changedValue?.value ?? null);
                }}
                formatOptionLabel={(option) => {
                  const { value, label } = option as SelectValue;
                  return <span data-value={value ?? 'null'}>{label}</span>;
                }}
                placeholder={placeholder}
                isDisabled={shouldDisableContentReach}
              />
            </FieldContainer>
          );
        }}
      />
    </FormFieldWrapper>
  );
};
