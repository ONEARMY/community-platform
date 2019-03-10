import React from 'react'
import styled from 'styled-components'
import { verticalAlign, VerticalAlignProps } from 'styled-system'

import {
  MdFileDownload,
  MdFileUpload,
  MdAdd,
  MdCheck,
  MdArrowBack,
  MdKeyboardArrowDown,
  MdAccountCircle,
} from 'react-icons/md'
import { IconContext } from 'react-icons'

interface IGlyphProps {
  glyph?: string
}

interface IProps {
  glyph?: string
  size?: number | string
}

type WrapperProps = IProps & VerticalAlignProps

export const IconWrapper = styled<WrapperProps, 'div'>('div')`
  display: inline-block;
  flex: 0 0 ${props => (props.size ? `${props.size}px` : '32px')};
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  min-width: ${props => (props.size ? `${props.size}px` : '32px')};
  min-height: ${props => (props.size ? `${props.size}px` : '32px')};
  position: relative;
  color: inherit;
  ${verticalAlign}
`

export const Glyph = ({ glyph }: IGlyphProps) => {
  switch (glyph) {
    case 'download':
      return <MdFileDownload />
    case 'upload':
      return <MdFileUpload />
    case 'add':
      return <MdAdd />
    case 'check':
      return <MdCheck />
    case 'arrow-back':
      return <MdArrowBack />
    case 'arrow-down':
      return <MdKeyboardArrowDown />
    case 'account-circle':
      return <MdAccountCircle />
    default:
      return null
  }
}

export default class Icon extends React.Component<WrapperProps> {
  constructor(props: WrapperProps) {
    super(props)
  }
  public render() {
    const { size = 32, glyph } = this.props

    return (
      <IconWrapper size={size} {...this.props}>
        <IconContext.Provider
          value={{ style: { width: size + 'px', height: size + 'px' } }}
        >
          <Glyph glyph={glyph} />
        </IconContext.Provider>
      </IconWrapper>
    )
  }
}
