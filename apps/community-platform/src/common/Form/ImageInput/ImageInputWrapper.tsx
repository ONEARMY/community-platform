import React from 'react'
import { Flex } from 'theme-ui'

import type { BoxProps } from 'theme-ui'

interface ITitleProps {
  hasUploadedImg: boolean
}

// any export to fix: https://github.com/microsoft/TypeScript/issues/37597
export const ImageInputWrapper = React.forwardRef<
  HTMLElement,
  BoxProps & ITitleProps
>((props, ref): JSX.Element => {
  const { hasUploadedImg, ...rest } = props

  return (
    <Flex
      className={'image-input__wrapper'}
      ref={ref}
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderColor: 'background',
        borderStyle: hasUploadedImg ? 'none' : 'dashed',
        borderRadius: 1,
        backgroundColor: 'white',
      }}
      {...rest}
    >
      {props.children}
    </Flex>
  )
})

ImageInputWrapper.displayName = 'ImageInputWrapper'
