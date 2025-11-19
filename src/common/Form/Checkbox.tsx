import { Label } from 'theme-ui';

import type { FieldProps } from './types';

export const CheckboxInput = ({ input, id, labelText, ...rest }: FieldProps) => {
  return (
    <>
      <input id={id} type="checkbox" {...input} {...rest}></input>
      <Label
        sx={{
          fontSize: 2,
          cursor: 'pointer',
        }}
        htmlFor={id}
      >
        {labelText}
      </Label>
    </>
  );
};
