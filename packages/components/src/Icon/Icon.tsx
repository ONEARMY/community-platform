/** @jsxImportSource theme-ui */
import styled from '@emotion/styled'
import { IconContext } from '@react-icons/all-files'
import { FaFacebookF } from '@react-icons/all-files/fa/FaFacebookF'
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram'
import { FaSignal } from '@react-icons/all-files/fa/FaSignal'
import { FaSlack } from '@react-icons/all-files/fa/FaSlack'
import { GoCloudUpload } from '@react-icons/all-files/go/GoCloudUpload'
import { GoFilePdf } from '@react-icons/all-files/go/GoFilePdf'
import { GoLinkExternal } from '@react-icons/all-files/go/GoLinkExternal'
import { MdAccessTime } from '@react-icons/all-files/md/MdAccessTime'
import { MdAccountCircle } from '@react-icons/all-files/md/MdAccountCircle'
import { MdAdd } from '@react-icons/all-files/md/MdAdd'
import { MdArrowBack } from '@react-icons/all-files/md/MdArrowBack'
import { MdArrowForward } from '@react-icons/all-files/md/MdArrowForward'
import { MdCheck } from '@react-icons/all-files/md/MdCheck'
import { MdEdit } from '@react-icons/all-files/md/MdEdit'
import { MdFileDownload } from '@react-icons/all-files/md/MdFileDownload'
import { MdImage } from '@react-icons/all-files/md/MdImage'
import { MdKeyboardArrowDown } from '@react-icons/all-files/md/MdKeyboardArrowDown'
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
import type { ThemeUIStyleObject } from 'theme-ui'
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
  sx?: ThemeUIStyleObject | undefined
}

export const glyphs: IGlyphs = {
  'account-circle': <MdAccountCircle />,
  add: <MdAdd />,
  account: iconMap.account,
  'arrow-back': <MdArrowBack />,
  'arrow-curved-bottom-right': iconMap.arrowCurvedBottomRight,
  'arrow-down': <MdKeyboardArrowDown />,
  'arrow-forward': <MdArrowForward />,
  'arrow-full-down': iconMap.arrowFullDown,
  'arrow-full-up': iconMap.arrowFullUp,
  bazar: iconMap.bazar,
  comment: iconMap.comment,
  contact: iconMap.contact,
  check: <MdCheck />,
  'chevron-down': iconMap.chevronDown,
  'chevron-left': iconMap.chevronLeft,
  'chevron-right': iconMap.chevronRight,
  'chevron-up': iconMap.chevronUp,
  close: iconMap.close,
  delete: iconMap.delete,
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
  hyperlink: iconMap.hyperlink,
  image: <MdImage />,
  impact: iconMap.impact,
  instagram: <FaInstagram />,
  loading: iconMap.loading,
  'location-on': <MdLocationOn />,
  lock: <MdLock />,
  machine: iconMap.machine,
  'mail-outline': <MdMailOutline />,
  map: iconMap.map,
  menu: <MdMenu />,
  'more-vert': <MdMoreVert />,
  notifications: <MdNotifications />,
  patreon: iconMap.patreon,
  pdf: <GoFilePdf />,
  plastic: iconMap.plastic,
  profile: iconMap.profile,
  revenue: iconMap.revenue,
  slack: <FaSlack />,
  sliders: iconMap.sliders,
  star: iconMap.star,
  'star-active': iconMap.starActive,
  step: iconMap.step,
  thunderbolt: iconMap.thunderbolt,
  'thunderbolt-grey': iconMap.thunderboltGrey,
  time: <MdAccessTime />,
  'turned-in': <MdTurnedIn />,
  'social-media': iconMap.socialMedia,
  supporter: iconMap.supporter,
  show: iconMap.show,
  update: iconMap.update,
  upload: <GoCloudUpload />,
  useful: iconMap.useful,
  verified: iconMap.verified,
  view: iconMap.view,
  volunteer: iconMap.volunteer,
  website: iconMap.website,
  search: iconMap.search,
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
  const { glyph, size, marginRight, sx } = props

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
      sx={{
        color: props.color ?? 'inherit',
        opacity: props.opacity ?? '1',
        '& svg': {
          fontSize: definedSize,
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      size={definedSize}
      style={{ marginRight }}
    >
      <IconContext.Provider
        value={{
          style: {
            width: definedSize,
            height: definedSize,
          },
        }}
      >
        <Glyph glyph={glyph} />
      </IconContext.Provider>
    </IconWrapper>
  )
}
