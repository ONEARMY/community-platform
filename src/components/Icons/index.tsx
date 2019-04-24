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
  MdEdit,
  MdCloudUpload,
} from 'react-icons/md'
import { GoCloudUpload } from 'react-icons/go'
import { IconContext } from 'react-icons'

interface IGlyphProps {
  glyph: string
}

interface IProps {
  glyph: keyof IGlyphs
  size?: number | string
}
type availableGlyphs =
  | 'download'
  | 'upload'
  | 'add'
  | 'check'
  | 'arrow-back'
  | 'arrow-down'
  | 'mail-outline'
  | 'notifications'
  | 'account-circle'
  | 'lock'
  | 'close'
  | 'delete'
  | 'more-vert'
  | 'comment'
  | 'turned-in'
  | 'edit'

export type IGlyphs = { [k in availableGlyphs]: JSX.Element }

export const glyphs: IGlyphs = {
  download: <MdFileDownload />,
  upload: <GoCloudUpload />,
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
  edit: <MdEdit />,
}

type WrapperProps = IProps & VerticalAlignProps

const IconWrapper = styled<WrapperProps, 'div'>('div')`
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

const Glyph = ({ glyph = '' }: IGlyphProps) => {
  return glyphs[glyph] || null
}

export class Icon extends Component<WrapperProps> {
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
          <Glyph glyph={glyph as string} />
        </IconContext.Provider>
      </IconWrapper>
    )
  }
}
export default Icon
