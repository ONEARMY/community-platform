import styled from '@emotion/styled'
import type { FlexProps as ThemeUiFlexProps } from 'theme-ui'
import { Flex as ThemeUiFlex } from 'theme-ui'

interface IFlexProps extends ThemeUiFlexProps {
  border?: boolean
  littleRadius?: boolean
  mediumRadius?: boolean
  largeRadius?: boolean
  card?: boolean
  cardHeading?: boolean
  littleScale?: boolean
  mediumScale?: boolean
}

const card = (props: IFlexProps) =>
  props.card ? { border: '2px solid black' } : null

const littleRadius = (props: IFlexProps) =>
  props.littleRadius ? { borderRadius: '5px' } : null

const mediumRadius = (props: IFlexProps) =>
  props.mediumRadius ? { borderRadius: '10px' } : null

const largeRadius = (props: IFlexProps) =>
  props.largeRadius ? { borderRadius: '15px' } : null

const littleScale = (props: IFlexProps) =>
  props.littleScale
    ? {
        transition: '.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.01)',
        },
      }
    : null

const mediumScale = (props: IFlexProps) =>
  props.mediumScale
    ? {
        transition: '.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }
    : null

export const Flex = styled(ThemeUiFlex, {
  // avoid passing on custom props
  shouldForwardProp: (prop: keyof IFlexProps) => {
    return ![
      'littleRadius',
      'mediumRadius',
      'largeRadius',
      'card',
      'littleScale',
      'mediumScale',
    ].includes(prop)
  },
})<IFlexProps>`
  ${littleRadius}
  ${mediumRadius}
  ${largeRadius}
  ${card}
  ${littleScale}
  ${mediumScale}
`

export default Flex
