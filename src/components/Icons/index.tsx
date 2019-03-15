import React, { Component } from 'react'
import styled from 'styled-components'
import { verticalAlign, VerticalAlignProps } from 'styled-system'

import {
  MdFileDownload,
  MdFileUpload,
  MdAdd,
  MdCheck,
  MdArrowBack,
  MdKeyboardArrowDown,
  MdMailOutline,
  MdNotifications,
  MdAccountCircle,
  MdLock,
  MdClose,
  MdDelete,
  MdMoreVert,
  MdComment,
  MdTurnedIn,
} from 'react-icons/md'
import { IconContext } from 'react-icons'

interface IGlyphProps {
  glyph?: string
}

interface IProps {
  glyph?: string
  size?: number | string
}

interface IGlyphs {
  download: JSX.Element
  upload: JSX.Element
  add: JSX.Element
  check: JSX.Element
  'arrow-back': JSX.Element
  'arrow-down': JSX.Element
  'mail-outline': JSX.Element
  notifications: JSX.Element
  'account-circle': JSX.Element
  lock: JSX.Element
  close: JSX.Element
  delete: JSX.Element
  'more-vert': JSX.Element
  comment: JSX.Element
  'turned-in': JSX.Element
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

export const glyphs: IGlyphs = {
  download: <MdFileDownload />,
  upload: <MdFileUpload />,
  add: <MdAdd />,
  check: <MdCheck />,
  'arrow-back': <MdArrowBack />,
  'arrow-down': <MdKeyboardArrowDown />,
  'mail-outline': <MdMailOutline />,
  notifications: <MdNotifications />,
  'account-circle': <MdAccountCircle />,
  lock: <MdLock />,
  close: <MdClose />,
  delete: <MdDelete />,
  'more-vert': <MdMoreVert />,
  comment: <MdComment />,
  'turned-in': <MdTurnedIn />,
}

const Glyph = ({ glyph = '' }: IGlyphProps) => {
  return glyphs[glyph] || null
}

class Icon extends Component<WrapperProps> {
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
export default Icon
