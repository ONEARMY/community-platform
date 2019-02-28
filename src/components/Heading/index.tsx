import * as React from 'react'

import { colors } from 'src/themes/styled.theme'
import { Heading as BaseHeading, HeadingProps } from 'rebass'

const Heading = (props: HeadingProps) => (
  <BaseHeading {...props}>{props.children}</BaseHeading>
)

Heading.defaultProps = {
  className: 'heading',
  color: colors.black,
}

export default Heading
