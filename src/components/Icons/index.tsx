import React from 'react'
import styled from 'styled-components'

import {
  MdFileDownload,
  MdFileUpload,
  MdAdd,
  MdCheck,
  MdArrowBack,
} from 'react-icons/md'
import { IconContext } from 'react-icons'

interface IGlyphProps {
  glyph?: string
}

interface IProps {
  glyph?: string
  size?: number | string
}

export const IconWrapper = styled.div`
  display: inline-block;
  flex: 0 0 ${props => (props.size ? `${props.size}px` : '32px')};
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  min-width: ${props => (props.size ? `${props.size}px` : '32px')};
  min-height: ${props => (props.size ? `${props.size}px` : '32px')};
  position: relative;
  color: inherit;
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
    default:
      return null
  }
}

export default class Icon extends React.Component<IProps> {
  constructor(props: any) {
    super(props)
  }
  public render() {
    const { size = 32, glyph } = this.props

    return (
      <IconWrapper size={size}>
        <IconContext.Provider
          value={{ style: { width: size + 'px', height: size + 'px' } }}
        >
          <Glyph glyph={glyph} />
        </IconContext.Provider>
      </IconWrapper>
    )
  }
}
