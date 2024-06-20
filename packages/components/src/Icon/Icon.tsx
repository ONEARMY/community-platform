/** @jsxImportSource theme-ui */
import styled from '@emotion/styled'
import { IconContext } from '@react-icons/all-files'
import { AiFillThunderbolt } from '@react-icons/all-files/ai/AiFillThunderbolt'
import { FaChevronDown } from '@react-icons/all-files/fa/FaChevronDown'
import { FaChevronUp } from '@react-icons/all-files/fa/FaChevronUp'
import { FaFacebookF } from '@react-icons/all-files/fa/FaFacebookF'
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram'
import { FaSignal } from '@react-icons/all-files/fa/FaSignal'
import { FaSlack } from '@react-icons/all-files/fa/FaSlack'
import { GoCloudUpload } from '@react-icons/all-files/go/GoCloudUpload'
import { GoFilePdf } from '@react-icons/all-files/go/GoFilePdf'
import { GoLinkExternal } from '@react-icons/all-files/go/GoLinkExternal'
import { GoTrashcan } from '@react-icons/all-files/go/GoTrashcan'
import { MdAccessTime } from '@react-icons/all-files/md/MdAccessTime'
import { MdAccountCircle } from '@react-icons/all-files/md/MdAccountCircle'
import { MdAdd } from '@react-icons/all-files/md/MdAdd'
import { MdArrowBack } from '@react-icons/all-files/md/MdArrowBack'
import { FiSend } from '@react-icons/all-files/fi/FiSend'
import { MdArrowForward } from '@react-icons/all-files/md/MdArrowForward'
import { MdCheck } from '@react-icons/all-files/md/MdCheck'
import { MdClose } from '@react-icons/all-files/md/MdClose'
import { MdEdit } from '@react-icons/all-files/md/MdEdit'
import { MdFileDownload } from '@react-icons/all-files/md/MdFileDownload'
import { MdImage } from '@react-icons/all-files/md/MdImage'
import { MdKeyboardArrowDown } from '@react-icons/all-files/md/MdKeyboardArrowDown'
import { MdList } from '@react-icons/all-files/md/MdList'
import { MdLocationOn } from '@react-icons/all-files/md/MdLocationOn'
import { MdLock } from '@react-icons/all-files/md/MdLock'
import { MdMail } from '@react-icons/all-files/md/MdMail'
import { MdMailOutline } from '@react-icons/all-files/md/MdMailOutline'
import { MdMenu } from '@react-icons/all-files/md/MdMenu'
import { MdMoreVert } from '@react-icons/all-files/md/MdMoreVert'
import { MdNotifications } from '@react-icons/all-files/md/MdNotifications'
import { MdTurnedIn } from '@react-icons/all-files/md/MdTurnedIn'
import { RiFilter2Fill } from '@react-icons/all-files/ri/RiFilter2Fill'
import { space, verticalAlign } from 'styled-system'

import { DownloadIcon } from './DownloadIcon'
import { ExternalUrl } from './ExternalUrl'
import { iconMap } from './svgs'

import type { SpaceProps, VerticalAlignProps } from 'styled-system'
import type { IGlyphs } from './types'

interface IGlyphProps {
  glyph: keyof IGlyphs
}

export interface IProps {
  glyph: keyof IGlyphs
  color?: string
  size?: number | string
  marginRight?: string
  opacity?: string
  onClick?: () => void
}

export const glyphs: IGlyphs = {
  'account-circle': <MdAccountCircle />,
  add: <MdAdd />,
  'arrow-back': <MdArrowBack />,
  'arrow-curved-bottom-right': iconMap.arrowCurvedBottomRight,
  'arrow-down': <MdKeyboardArrowDown />,
  'arrow-forward': <MdArrowForward />,
  'arrow-full-down': iconMap.arrowFullDown,
  'arrow-full-up': iconMap.arrowFullUp,
  bazar: iconMap.bazar,
  comment: iconMap.comment,
  check: <MdCheck />,
  'chevron-down': <FaChevronDown />,
  'chevron-left': iconMap.chevronLeft,
  'chevron-right': iconMap.chevronRight,
  'chevron-up': <FaChevronUp />,
  close: <MdClose />,
  delete: <GoTrashcan />,
  difficulty: <FaSignal />,
  discord: iconMap.discord,
  download: <MdFileDownload />,
  'download-cloud': <DownloadIcon />,
  edit: <MdEdit />,
  email: <MdMail />,
  employee: iconMap.employee,
  'email-outline': iconMap.emailOutline,
  'external-link': <GoLinkExternal />,
  'external-url': <ExternalUrl />,
  facebook: <FaFacebookF />,
  filter: <RiFilter2Fill />,
  'flag-unknown': iconMap.flagUnknown,
  hide: iconMap.hide,
  image: <MdImage />,
  instagram: <FaInstagram />,
  loading: iconMap.loading,
  'location-on': <MdLocationOn />,
  lock: <MdLock />,
  machine: iconMap.machine,
  'mail-outline': <MdMailOutline />,
  menu: <MdMenu />,
  'more-vert': <MdMoreVert />,
  notifications: <MdNotifications />,
  pdf: <GoFilePdf />,
  plastic: iconMap.plastic,
  revenue: iconMap.revenue,
  slack: <FaSlack />,
  star: iconMap.star,
  'star-active': iconMap.starActive,
  step: <MdList />,
  thunderbolt: <AiFillThunderbolt />,
  time: <MdAccessTime />,
  'turned-in': <MdTurnedIn />,
  'social-media': iconMap.socialMedia,
  'send': <FiSend />,
  supporter: iconMap.supporter,
  show: iconMap.show,
  update: iconMap.update,
  upload: <GoCloudUpload />,
  useful: iconMap.useful,
  verified: iconMap.verified,
  view: iconMap.view,
  volunteer: iconMap.volunteer,
  website: iconMap.website,
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
  
  svg {
    width: 100%;
    height: 100%;
  }
  
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
