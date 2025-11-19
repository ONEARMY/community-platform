import React from 'react';
import { MemberBadge } from 'oa-components';
import { Flex, Input, Label, Text } from 'theme-ui';

import { HiddenInput } from '../elements';

import type { ProfileType } from 'oa-shared';
import type { FieldRenderProps } from 'react-final-form';

interface IProps {
  value: ProfileType;
  onChange: (value: string) => void;
  isSelected: boolean;
  textLabel?: string;
  subText?: string;
  name: string;
  fullWidth?: boolean;
  required?: boolean;
  'data-cy'?: string;
  theme?: any;
}

type FieldProps = FieldRenderProps<any, any> & {
  children?: React.ReactNode;
  disabled?: boolean;
  'data-cy'?: string;
  customOnBlur?: (event) => void;
};

const HiddenInputField = ({ input, meta, ...rest }: FieldProps) => (
  <>
    <Input
      type="hidden"
      variant={meta.error && meta.touched ? 'error' : 'input'}
      {...input}
      {...rest}
    />
  </>
);

// validation - return undefined if no error (i.e. valid)
const isRequired = (value: any) => (value ? undefined : 'Required');

export const ProfileTypeRadioField = (props: IProps) => {
  const {
    value,
    isSelected,
    textLabel,
    subText,
    name,
    fullWidth,
    required,
    'data-cy': dataCy,
  } = props;

  const classNames: string[] = [];
  if (isSelected) {
    classNames.push('selected');
  }
  if (fullWidth) {
    classNames.push('full-width');
  }

  return (
    <Label
      sx={{
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        py: 2,
        gap: 2,
        borderRadius: 2,
        border: '2px solid transparent',
        ':hover': {
          backgroundColor: 'background',
          cursor: 'pointer',
        },
        '&.selected': {
          backgroundColor: 'background',
          borderColor: 'green',
        },
      }}
      htmlFor={value.name}
      className={classNames.join(' ')}
      data-cy={dataCy}
    >
      <HiddenInput
        id={value.name}
        name={name}
        value={value.name}
        type="radio"
        component={HiddenInputField}
        checked={isSelected}
        validate={required ? isRequired : undefined}
        validateFields={[]}
        onChange={(v) => props.onChange(v.target.value)}
      />
      <Flex
        sx={{
          width: ['130px', '130px', '100%'],
          height: ['130px', '130px', '100%'],
          alignContent: 'center',
          padding: 2,
        }}
      >
        <MemberBadge size={130} profileType={value} />
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        {textLabel && (
          <Text
            sx={{
              display: 'block',
              fontSize: 2,
              fontWeight: ['bold', 'bold', 'inherit'],
              textAlign: ['center'],
            }}
          >
            {textLabel}
          </Text>
        )}
        {subText && (
          <Text
            sx={{
              textAlign: 'center',
              fontSize: 1,
              display: 'block',
              marginTop: 1,
              marginBottom: 1,
              color: 'gray',
            }}
          >
            {subText}
          </Text>
        )}
      </Flex>
    </Label>
  );
};
