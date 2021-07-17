import { Component } from 'react'
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
  MdArrowDownward,
  MdArrowUpward,
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
  MdMail,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md'
import {
  GoCloudUpload,
  GoFilePdf,
  GoTrashcan,
  GoLinkExternal,
} from 'react-icons/go'
import { FaSignal, FaFacebookF, FaSlack, FaInstagram } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import SVGs from './svgs'
import { DownloadIcon } from './DownloadIcon'

interface IGlyphProps {
  glyph: string
}

interface IProps {
  glyph: keyof IGlyphs
  size?: any
  marginRight?: string
  color?: string
  onClick?: () => void
}
export type availableGlyphs =
  | 'download'
  | 'download-cloud'
  | 'upload'
  | 'add'
  | 'check'
  | 'arrow-back'
  | 'arrow-full-down'
  | 'arrow-full-up'
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
  | 'facebook'
  | 'instagram'
  | 'slack'
  | 'email'
  | 'chevron-left'
  | 'chevron-right'
  | 'star'
  | 'star-active'

export type IGlyphs = { [k in availableGlyphs]: JSX.Element }

export const glyphs: IGlyphs = {
  download: <MdFileDownload />,
  'download-cloud': <DownloadIcon />,
  upload: <GoCloudUpload />,
  add: <MdAdd />,
  check: <MdCheck />,
  'arrow-back': <MdArrowBack />,
  'arrow-forward': <MdArrowForward />,
  'arrow-full-down': <MdArrowDownward />,
  'arrow-full-up': <MdArrowUpward />,
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
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  slack: <FaSlack />,
  email: <MdMail />,
  'chevron-left': <MdChevronLeft />,
  'chevron-right': <MdChevronRight />,
  star: SVGs.star,
  'star-active': SVGs.starActive,
}

type WrapperProps = IProps & VerticalAlignProps & SpaceProps

const IconWrapper = styled.div<WrapperProps>`
  display: inline-block;
  flex: 0 0 ${props => (props.size ? `${props.size}px` : '32px')};
  width: ${props => (props.size ? `${props.size}px` : '32px')};
  height: ${props => (props.size ? `${props.size}px` : '32px')};
  min-width: ${props => (props.size ? `${props.size}px` : '32px')};
  min-height: ${props => (props.size ? `${props.size}px` : '32px')};
  position: relative;
  color: ${props => (props.color ? `${props.color}` : 'inherit')};
  ${verticalAlign}
  ${space}

  ${props =>
    props.onClick &&
    `
    cursor: pointer;
  `}
`

const Glyph = ({ glyph = '' }: IGlyphProps) => {
  return glyphs[glyph] || null
}

export class Icon extends Component<WrapperProps> {
  // eslint-disable-next-line
  constructor(props: WrapperProps) {
    super(props)
  }
  public render() {
    const { glyph } = this.props

    const sizeMap = {
      xs: 8,
      sm: 16,
      md: 32,
      lg: 48,
      xl: 64,
    }

    let { size } = this.props
    const isSizeNumeric = size - parseFloat(size) + 1 >= 0
    size = isSizeNumeric ? size : sizeMap[size]
    size = size || 16

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
