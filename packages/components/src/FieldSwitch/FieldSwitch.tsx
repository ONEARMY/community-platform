import type { FieldRenderProps } from 'react-final-form';
import { Flex, Switch, Text } from 'theme-ui';

type FieldProps = FieldRenderProps<boolean, any>;

export interface Props extends FieldProps {
  disabled?: boolean;
  'data-cy'?: string;
}

export const FieldSwitch = ({ input, meta, disabled, ...rest }: Props) => {
  const { value, type, ...inputProps } = input;

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      {meta.error && meta.touched && <Text sx={{ fontSize: 1, color: 'error' }}>{meta.error}</Text>}
      <Switch {...inputProps} {...rest} disabled={disabled} checked={!!value} />
    </Flex>
  );
};
