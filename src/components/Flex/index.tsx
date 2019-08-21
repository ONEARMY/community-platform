import * as React from 'react'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { Flex as RebassFlex, FlexProps as RebassFlexProps } from 'rebass'

export interface IFlexProps {
  border?: boolean
  litleRadius?: boolean
  mediumRadius?: boolean
  largeRadius?: boolean
  card?: boolean
  cardHeading?: boolean
  litleScale?: boolean
  mediumScale?: boolean
}

export const card = (props: IFlexProps) =>
  props.card
    ? { border: '2px solid black', overflow: 'hidden', background: 'white' }
    : null

export const cardHeading = (props: IFlexProps) =>
  props.cardHeading
    ? {
        border: '2px solid black',
        overflow: 'hidden',
        background: theme.colors.blue,
      }
    : null
export const border = (props: IFlexProps) =>
  props.border ? { border: '2px solid black', overflow: 'hidden' } : null

export const litleRadius = (props: IFlexProps) =>
  props.litleRadius ? { borderRadius: '5px' } : null

export const mediumRadius = (props: IFlexProps) =>
  props.mediumRadius ? { borderRadius: '10px' } : null

export const largeRadius = (props: IFlexProps) =>
  props.largeRadius ? { borderRadius: '15px' } : null

export const litleScale = (props: IFlexProps) =>
  props.litleScale
    ? {
        transition: '.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.01)',
        },
      }
    : null

export const mediumScale = (props: IFlexProps) =>
  props.mediumScale
    ? {
        transition: '.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }
    : null

export const BaseFlex = styled(RebassFlex)`
    ${border}
    ${litleRadius}
    ${mediumRadius}
    ${largeRadius}
    ${card}
    ${cardHeading}
    ${litleScale}
    ${mediumScale}
`

type FlexProps = IFlexProps & RebassFlexProps

// TODO - incorporate custom css into rebass props to allow things like below to be passed
export const Flex = (props: FlexProps) => (
  <BaseFlex {...props}>{props.children}</BaseFlex>
)

export default Flex
