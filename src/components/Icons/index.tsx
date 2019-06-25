import React, { Component } from 'react'
import styled from 'styled-components'
import {
  verticalAlign,
  VerticalAlignProps,
  space,
  SpaceProps,
} from 'styled-system'

import {
  MdFileDownload,
  MdAdd,
  MdCheck,
  MdArrowBack,
  MdKeyboardArrowDown,
  MdMailOutline,
  MdNotifications,
  MdAccountCircle,
  MdLock,
  MdClose,
  MdMoreVert,
  MdComment,
  MdTurnedIn,
  MdEdit,
  MdAccessTime,
  MdList,
  MdImage,
  MdArrowForward,
  MdLocationOn,
} from 'react-icons/md'
import {
  GoCloudUpload,
  GoFilePdf,
  GoTrashcan,
  GoLinkExternal,
} from 'react-icons/go'
import { FaSignal } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import SVGs from './svgs'

interface IGlyphProps {
  glyph: string
}

interface IProps {
  glyph: keyof IGlyphs
  size?: number | string
  marginRight?: string
  OnClick?: () => void
}
export type availableGlyphs =
  | 'download'
  | 'upload'
  | 'add'
  | 'check'
  | 'arrow-back'
  | 'arrow-forward'
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
  | 'time'
  | 'step'
  | 'difficulty'
  | 'image'
  | 'pdf'
  | 'loading'
  | 'location-on'
  | 'external-link'

export type IGlyphs = { [k in availableGlyphs]: JSX.Element }

export const glyphs: IGlyphs = {
  download: <MdFileDownload />,
  upload: <GoCloudUpload />,
  add: <MdAdd />,
  check: <MdCheck />,
  'arrow-back': <MdArrowBack />,
  'arrow-forward': <MdArrowForward />,
  'arrow-down': <MdKeyboardArrowDown />,
  'mail-outline': <MdMailOutline />,
  notifications: <MdNotifications />,
  'account-circle': <MdAccountCircle />,
  lock: <MdLock />,
  close: <MdClose />,
  delete: <GoTrashcan />,
  'more-vert': <MdMoreVert />,
  comment: <MdComment />,
  'turned-in': <MdTurnedIn />,
  edit: <MdEdit />,
  time: <MdAccessTime />,
  step: <MdList />,
  difficulty: <FaSignal />,
  image: <MdImage />,
  pdf: <GoFilePdf />,
  loading: SVGs.loading,
  'location-on': <MdLocationOn />,
  'external-link': <GoLinkExternal />,
}

type WrapperProps = IProps & VerticalAlignProps & SpaceProps

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
  ${space}
`

const Glyph = ({ glyph = '' }: IGlyphProps) => {
  return glyphs[glyph] || null
}

export class Icon extends Component<WrapperProps> {
  constructor(props: WrapperProps) {
    super(props)
  }
  public render() {
    const { size = 16, glyph } = this.props

    return (
      <IconWrapper
        size={size}
        {...this.props}
        style={{ marginRight: this.props.marginRight }}
      >
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
