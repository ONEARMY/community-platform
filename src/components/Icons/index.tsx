import React, { Component } from 'react'
import styled from 'styled-components'
import {
  verticalAlign,
  VerticalAlignProps,
  space,
  SpaceProps,
} from 'styled-system'

import EventsIcon from 'src/assets/icons/icon-events.svg'
import ExpertIcon from 'src/assets/icons/icon-expert.svg'
import HowToCountIcon from 'src/assets/icons/icon-how-to.svg'
import V4MemberIcon from 'src/assets/icons/icon-v4-member.svg'
import DiscordIcon from 'src/assets/icons/icon-discord.svg'
import BazarIcon from 'src/assets/icons/icon-bazar.svg'
import SocialIcon from 'src/assets/icons/icon-social-media.svg'

import {
  MdFileDownload,
  MdAdd,
  MdCheck,
  MdArrowBack,
  MdArrowDownward,
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
import {
  FaSignal,
  FaFacebookF,
  FaSlack,
  FaInstagram,
  FaDiscord,
} from 'react-icons/fa'
import { IconContext } from 'react-icons'
import SVGs from './svgs'

interface IGlyphProps {
  glyph: string
}

interface IProps {
  glyph: keyof IGlyphs
  size?: number | string
  marginRight?: string
  color?: string
  OnClick?: () => void
}
export type availableGlyphs =
  | 'download'
  | 'upload'
  | 'add'
  | 'check'
  | 'arrow-back'
  | 'arrow-full-down'
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
  | 'discord'
  | 'email'
  | 'chevron-left'
  | 'chevron-right'

export type IGlyphs = { [k in availableGlyphs]: JSX.Element }

const DiscordIconComp = () => <img src={DiscordIcon} />

export const glyphs: IGlyphs = {
  download: <MdFileDownload />,
  upload: <GoCloudUpload />,
  add: <MdAdd />,
  check: <MdCheck />,
  'arrow-back': <MdArrowBack />,
  'arrow-forward': <MdArrowForward />,
  'arrow-full-down': <MdArrowDownward />,
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
  discord: <DiscordIconComp />,
  email: <MdMail />,
  'chevron-left': <MdChevronLeft />,
  'chevron-right': <MdChevronRight />,
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
    size = Number.isInteger(size) ? size : sizeMap[size]
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
