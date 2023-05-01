/** @jsxImportSource theme-ui */
import styled from '@emotion/styled'
import type { VerticalAlignProps, SpaceProps } from 'styled-system'
import { verticalAlign, space } from 'styled-system'
import { MdFileDownload } from '@react-icons/all-files/md/MdFileDownload'
import { MdAdd } from '@react-icons/all-files/md/MdAdd'
import { MdCheck } from '@react-icons/all-files/md/MdCheck'
import { MdArrowBack } from '@react-icons/all-files/md/MdArrowBack'
import { MdArrowDownward } from '@react-icons/all-files/md/MdArrowDownward'
import { MdArrowUpward } from '@react-icons/all-files/md/MdArrowUpward'
import { MdKeyboardArrowDown } from '@react-icons/all-files/md/MdKeyboardArrowDown'
import { MdMailOutline } from '@react-icons/all-files/md/MdMailOutline'
import { MdNotifications } from '@react-icons/all-files/md/MdNotifications'
import { MdAccountCircle } from '@react-icons/all-files/md/MdAccountCircle'
import { MdLock } from '@react-icons/all-files/md/MdLock'
import { MdClose } from '@react-icons/all-files/md/MdClose'
import { MdMoreVert } from '@react-icons/all-files/md/MdMoreVert'
import { MdTurnedIn } from '@react-icons/all-files/md/MdTurnedIn'
import { MdEdit } from '@react-icons/all-files/md/MdEdit'
import { MdAccessTime } from '@react-icons/all-files/md/MdAccessTime'
import { MdList } from '@react-icons/all-files/md/MdList'
import { MdImage } from '@react-icons/all-files/md/MdImage'
import { MdArrowForward } from '@react-icons/all-files/md/MdArrowForward'
import { MdLocationOn } from '@react-icons/all-files/md/MdLocationOn'
import { MdMail } from '@react-icons/all-files/md/MdMail'
import { MdChevronLeft } from '@react-icons/all-files/md/MdChevronLeft'
import { MdChevronRight } from '@react-icons/all-files/md/MdChevronRight'
import { GoCloudUpload } from '@react-icons/all-files/go/GoCloudUpload'
import { GoFilePdf } from '@react-icons/all-files/go/GoFilePdf'
import { GoTrashcan } from '@react-icons/all-files/go/GoTrashcan'
import { GoLinkExternal } from '@react-icons/all-files/go/GoLinkExternal'
import { AiFillThunderbolt } from '@react-icons/all-files/ai/AiFillThunderbolt'
import { FaSignal } from '@react-icons/all-files/fa/FaSignal'
import { FaFacebookF } from '@react-icons/all-files/fa/FaFacebookF'
import { FaSlack } from '@react-icons/all-files/fa/FaSlack'
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram'
import { RiFilter2Fill } from '@react-icons/all-files/ri/RiFilter2Fill'
import { IconContext } from '@react-icons/all-files'
import { iconMap } from './svgs'
import { DownloadIcon } from './DownloadIcon'
import { ExternalUrl } from './ExternalUrl'
import type { IGlyphs } from './types'

interface IGlyphProps {
  glyph: keyof IGlyphs
}

export interface IProps {
  glyph: keyof IGlyphs
  size?: number | string
  marginRight?: string
  color?: string
  onClick?: () => void
}

export const glyphs: IGlyphs = {
  download: <MdFileDownload />,
  'download-cloud': <DownloadIcon />,
  'external-url': <ExternalUrl />,
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
  comment: iconMap.comment,
  'turned-in': <MdTurnedIn />,
  edit: <MdEdit />,
  time: <MdAccessTime />,
  step: <MdList />,
  difficulty: <FaSignal />,
  image: <MdImage />,
  pdf: <GoFilePdf />,
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
      sx={{ color: props.color ?? 'inherit' }}
      size={definedSize}
      style={{ marginRight }}
    >
      <IconContext.Provider
        value={{
          style: { width: definedSize + 'px', height: definedSize + 'px' },
        }}
      >
        <Glyph glyph={glyph} />
      </IconContext.Provider>
    </IconWrapper>
  )
}
