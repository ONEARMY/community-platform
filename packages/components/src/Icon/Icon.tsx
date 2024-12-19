/** @jsxImportSource theme-ui */
import { IconContext } from 'react-icons'
import {
  FaCloudUploadAlt,
  FaFacebookF,
  FaFilePdf,
  FaFilter,
  FaInstagram,
  FaSignal,
  FaSlack,
} from 'react-icons/fa'
import { GoLinkExternal } from 'react-icons/go'
import {
  MdAccessTime,
  MdAccountCircle,
  MdAdd,
  MdArrowBack,
  MdArrowForward,
  MdCheck,
  MdEdit,
  MdFileDownload,
  MdImage,
  MdKeyboardArrowDown,
  MdLocationOn,
  MdLock,
  MdMail,
  MdMailOutline,
  MdMenu,
  MdMoreVert,
  MdNotifications,
  MdTurnedIn,
} from 'react-icons/md'
import styled from '@emotion/styled'
import { space, verticalAlign } from 'styled-system'

import { DownloadIcon } from './DownloadIcon'
import { ExternalUrl } from './ExternalUrl'
import { iconMap } from './svgs'

import type { SpaceProps, VerticalAlignProps } from 'styled-system'
import type { ThemeUIStyleObject } from 'theme-ui'
import type { IGlyphs } from './types'

export interface IProps extends React.ButtonHTMLAttributes<HTMLElement> {
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
  category: iconMap.category,
  comment: iconMap.comment,
  construction: iconMap.construction,
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
  filter: <FaFilter />,
  'flag-unknown': iconMap.flagUnknown,
  food: iconMap.food,
  globe: iconMap.globe,
  'gps-location': iconMap.gpsLocation,
  guides: iconMap.guides,
  hide: iconMap.hide,
  hyperlink: iconMap.hyperlink,
  image: <MdImage />,
  impact: iconMap.impact,
  instagram: <FaInstagram />,
  landscape: iconMap.landscape,
  loading: iconMap.loading,
  'location-on': <MdLocationOn />,
  lock: <MdLock />,
  machine: iconMap.machine,
  machines: iconMap.machines,
  'mail-outline': <MdMailOutline />,
  map: iconMap.map,
  menu: <MdMenu />,
  moulds: iconMap.moulds,
  'more-vert': <MdMoreVert />,
  notifications: <MdNotifications />,
  other: iconMap.other,
  patreon: iconMap.patreon,
  pdf: <FaFilePdf />,
  plastic: iconMap.plastic,
  products: iconMap.products,
  profile: iconMap.profile,
  revenue: iconMap.revenue,
  search: iconMap.search,
  slack: <FaSlack />,
  sliders: iconMap.sliders,
  star: iconMap.star,
  'starter kits': iconMap.starterKits,
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
  upload: <FaCloudUploadAlt />,
  utilities: iconMap.utilities,
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

export const getGlyph = (glyph: string) => {
  return glyph in glyphs ? glyphs[glyph as keyof IGlyphs] : null
}

export const Icon = (props: Props) => {
  const { glyph, size, sx } = props

  if (!getGlyph(glyph)) {
    return null
  }

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
    >
      <IconContext.Provider
        value={{
          style: {
            width: definedSize,
            height: definedSize,
          },
        }}
      >
        {getGlyph(glyph)}
      </IconContext.Provider>
    </IconWrapper>
  )
}
