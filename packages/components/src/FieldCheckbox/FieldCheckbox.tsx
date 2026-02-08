import styled from '@emotion/styled';
import type { FieldRenderProps } from 'react-final-form';
import { Flex, Text } from 'theme-ui';

type FieldProps = FieldRenderProps<boolean, any>;

export interface Props extends FieldProps {
  disabled?: boolean;
  'data-cy'?: string;
}

const StyledCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const FieldCheckbox = ({ input, meta, disabled, ...rest }: Props) => {
  const { value, type, ...inputProps } = input;

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      {meta.error && meta.touched && <Text sx={{ fontSize: 1, color: 'error' }}>{meta.error}</Text>}
      <StyledCheckbox {...inputProps} {...rest} type="checkbox" disabled={disabled} checked={!!value} />
    </Flex>
  );
};
