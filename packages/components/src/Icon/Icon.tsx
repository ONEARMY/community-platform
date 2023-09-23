/** @jsxImportSource theme-ui */
import styled from '@emotion/styled'
import { AiFillThunderbolt } from 'react-icons/ai'
import { BsCloudUpload, BsTrash } from 'react-icons/bs'
import { FaFacebookF, FaInstagram, FaSignal, FaSlack } from 'react-icons/fa'
import { GoLinkExternal } from 'react-icons/go'
import { GrDocumentPdf } from 'react-icons/gr'
import {
  MdAccessTime,
  MdAccountCircle,
  MdAdd,
  MdArrowBack,
  MdArrowDownward,
  MdArrowForward,
  MdArrowUpward,
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdEdit,
  MdFileDownload,
  MdImage,
  MdKeyboardArrowDown,
  MdList,
  MdLocationOn,
  MdLock,
  MdMail,
  MdMailOutline,
  MdMoreVert,
  MdNotifications,
  MdTurnedIn,
} from 'react-icons/md'
import { RiFilter2Fill } from 'react-icons/ri'
import type { SpaceProps, VerticalAlignProps } from 'styled-system'
import { space, verticalAlign } from 'styled-system'
import { Box } from 'theme-ui'
import { DownloadIcon } from './DownloadIcon'
import { ExternalUrl } from './ExternalUrl'
import { iconMap } from './svgs'
import type { IGlyphs } from './types'

interface IGlyphProps {
  glyph: keyof IGlyphs
}

export interface IProps {
  glyph: keyof IGlyphs
  size?: number | string
  marginRight?: string
  color?: string
  opacity?: string
  onClick?: () => void
}

export const glyphs: IGlyphs = {
  download: <MdFileDownload />,
  'download-cloud': <DownloadIcon />,
  'external-url': <ExternalUrl />,
  upload: <BsCloudUpload />,
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
  delete: <BsTrash />,
  'more-vert': <MdMoreVert />,
  comment: iconMap.comment,
  'turned-in': <MdTurnedIn />,
  edit: <MdEdit />,
  time: <MdAccessTime />,
  step: <MdList />,
  difficulty: <FaSignal />,
  image: <MdImage />,
  pdf: <GrDocumentPdf />,
  loading: iconMap.loading,
  'location-on': <MdLocationOn />,
  'external-link': <GoLinkExternal />,
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  slack: <FaSlack />,
  email: <MdMail />,
  'chevron-left': <MdChevronLeft />,
  'chevron-right': <MdChevronRight />,
  star: iconMap.star,
  'star-active': iconMap.starActive,
  verified: iconMap.verified,
  useful: iconMap.useful,
  thunderbolt: <AiFillThunderbolt />,
  filter: <RiFilter2Fill />,
  view: iconMap.view,
  supporter: iconMap.supporter,
  'flag-unknown': iconMap.flagUnknown,
  'social-media': iconMap.socialMedia,
  website: iconMap.website,
  bazar: iconMap.bazar,
  'email-outline': iconMap.emailOutline,
  discord: iconMap.discord,
  update: iconMap.update,
  show: iconMap.show,
  hide: iconMap.hide,
}

export type Props = IProps & VerticalAlignProps & SpaceProps

const IconWrapper = styled.div<Props>`
  display: inline-block;
  flex: 0 0 ${(props) => (props.size ? `${props.size}px` : '32px')};
  width: ${(props) => (props.size ? `${props.size}px` : '32px')};
  height: ${(props) => (props.size ? `${props.size}px` : '32px')};
  min-width: ${(props) => (props.size ? `${props.size}px` : '32px')};
  min-height: ${(props) => (props.size ? `${props.size}px` : '32px')};
  position: relative;
  ${verticalAlign} ${space}
    ${(props) =>
    props.onClick &&
    `
    cursor: pointer;
  `};
`

const sizeMap = {
  xs: 8,
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
}

const Glyph = ({ glyph }: IGlyphProps) => {
  return glyphs[glyph] || null
}

export const Icon = (props: Props) => {
  const { glyph, size, marginRight } = props

  const isSizeNumeric = !isNaN(size as any)

  let definedSize = 16

  if (isSizeNumeric) {
    definedSize = size as number
  } else if (Object.keys(sizeMap).includes(size as string)) {
    const pointer = size as 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    definedSize = sizeMap[pointer]
  }

  return (
    <IconWrapper
      {...props}
      sx={{ color: props.color ?? 'inherit', opacity: props.opacity ?? '1' }}
      size={definedSize}
      style={{ marginRight }}
    >
      <Box
        style={{
          width: definedSize + 'px',
          height: definedSize + 'px',
        }}
      >
        <Glyph glyph={glyph} />
      </Box>
    </IconWrapper>
  )
}
