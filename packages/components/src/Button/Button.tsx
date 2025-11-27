import * as React from 'react';
import { Button as ThemeUiButton, Flex, Text } from 'theme-ui';

import { Icon } from '../Icon/Icon';

import type { ButtonProps as ThemeUiButtonProps } from 'theme-ui';
import type { IGlyphs } from '../Icon/types';

// extend to allow any default button props (e.g. onClick) to also be passed
export interface IBtnProps extends React.ButtonHTMLAttributes<HTMLElement> {
  icon?: keyof IGlyphs;
  disabled?: boolean;
  small?: boolean;
  large?: boolean;
  showIconOnly?: boolean;
  iconColor?: string;
  iconFilter?: string;
}

type ToArray<Type> = [Type] extends [any] ? Type[] : never;
type AvailableButtonProps = ToArray<keyof BtnProps>;

const buttonSizeProps: { [key: string]: any } = {
  small: {
    px: 2,
    py: 1,
    pl: '2rem',
    fontSize: 1,
    height: '2rem',
  },
  default: {
    px: 3,
    pl: 9,
  },
  large: {
    px: 4,
    py: 3,
    pl: 10,
    fontSize: 4,
    height: '3.5rem',
  },
};

export type BtnProps = IBtnProps & ThemeUiButtonProps;

function getSizeProps(size: string, hasIcon: boolean) {
  if (!buttonSizeProps[size] && !hasIcon) {
    return {};
  }

  if (!buttonSizeProps[size] && hasIcon) {
    return {
      px: 3,
      pl: 9,
    };
  }

  const sizeProps = { ...buttonSizeProps[size] };

  if (!hasIcon) {
    delete sizeProps.pl;
  }

  return sizeProps;
}

function getScaleTransform(size: string) {
  if (size === 'large') {
    return 1.25;
  }

  return 1;
}

function sanitizedProps(obj: BtnProps, keysToRemove: AvailableButtonProps) {
  const sanitizedObj = { ...obj };

  keysToRemove.forEach((prop) => {
    if (sanitizedObj[prop]) {
      delete sanitizedObj[prop];
    }
  });

  return sanitizedObj;
}

export const Button = (props: BtnProps) => {
  let size = 'default';

  if (props.small === true) {
    size = 'small';
  } else if (props.large === true) {
    size = 'large';
  }

  return (
    <ThemeUiButton
      {...sanitizedProps(props, ['small', 'large', 'showIconOnly', 'iconColor', 'iconFilter'])}
      sx={{
        ...getSizeProps(size, !!props.icon),
        ...(props.showIconOnly ? { pr: 0, WebkitTapHighlightColor: 'transparent' } : {}),
        ...props.sx,
      }}
    >
      {props.icon && (
        <Flex
          aria-hidden={true}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: getSizeProps(size, !!props.icon)?.px || 0,
            boxSizing: 'border-box',
            fontSize: 0,
            maxWidth: '100%',
            lineHeight: 0,
            transform: `translateY(-1px) scale(${getScaleTransform(size)})`,
            pointerEvents: 'none',
          }}
        >
          <Icon glyph={props.icon} color={props.iconColor} filter={props.iconFilter} />
        </Flex>
      )}
      <Text
        sx={{
          ...(props.showIconOnly
            ? {
                clipPath: 'inset(100%)',
                clip: 'rect(1px, 1px, 1px, 1px)',
                height: '1px',
                overflow: 'hidden',
                position: 'absolute',
                whiteSpace: 'nowrap',
                width: '1px',
              }
            : {}),
        }}
      >
        {props.children}
      </Text>
    </ThemeUiButton>
  );
};
