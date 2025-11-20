import { forwardRef } from 'react';
import { Flex } from 'theme-ui';

import type { JSX } from 'react';
import type { BoxProps } from 'theme-ui';

interface ITitleProps {
  hasUploadedImg: boolean;
  sx?: any;
}

// any export to fix: https://github.com/microsoft/TypeScript/issues/37597
export const ImageInputWrapper = forwardRef<HTMLElement, BoxProps & ITitleProps>(
  (props, ref): JSX.Element => {
    const { hasUploadedImg, sx, ...rest } = props;

    return (
      <Flex
        className={'image-input__wrapper'}
        ref={ref}
        sx={{
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          borderColor: 'background',
          borderStyle: hasUploadedImg ? 'none' : 'dashed',
          borderRadius: 1,
          backgroundColor: 'white',
          height: '100%',
          ...sx,
        }}
        {...rest}
      >
        {props.children}
      </Flex>
    );
  },
);

ImageInputWrapper.displayName = 'ImageInputWrapper';
