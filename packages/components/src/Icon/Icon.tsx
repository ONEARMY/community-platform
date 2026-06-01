/** @jsxImportSource theme-ui */

import styled from '@emotion/styled';
import type { Colors } from 'oa-themes';
import { IconContext } from 'react-icons';
import { FaCloudUploadAlt, FaFilePdf, FaFilter, FaSignal } from 'react-icons/fa';
import {
  MdAccessTime,
  MdAccountCircle,
  MdAdd,
  MdArrowBack,
  MdArrowForward,
  MdCheck,
  MdFileDownload,
  MdImage,
  MdKeyboardArrowDown,
  MdLocationOn,
  MdLock,
  MdMailOutline,
  MdMenu,
  MdMoreVert,
  MdNotifications,
  MdTurnedIn,
} from 'react-icons/md';
import type { SpaceProps, VerticalAlignProps } from 'styled-system';
import { space, verticalAlign } from 'styled-system';
import type { ThemeUIStyleObject } from 'theme-ui';
import { DonateIcon } from './DonateIcon';
import { DownloadIcon } from './DownloadIcon';
import { ExternalUrl } from './ExternalUrl';
import { iconMap } from './svgs';
import type { IGlyphs } from './types';

export interface IProps extends React.ButtonHTMLAttributes<HTMLElement> {
  glyph: keyof IGlyphs;
  color?: Colors;
  filter?: string;
  size?: number | string;
  marginRight?: string;
  opacity?: string;
  onClick?: () => void;
  sx?: ThemeUIStyleObject | undefined;
}

export const glyphs: IGlyphs = {
  'account-circle': <MdAccountCircle />,
  add: <MdAdd />,
  account: iconMap.account,
  approved: iconMap.approved,
  'arrow-back': <MdArrowBack />,
  'arrow-down': <MdKeyboardArrowDown />,
  'arrow-forward': <MdArrowForward />,
  'arrow-full-down': iconMap.arrowFullDown,
  'arrow-full-up': iconMap.arrowFullUp,
  attention: iconMap.attention,
  bazar: iconMap.bazar,
  comment: iconMap.comment,
  'comment-outline': iconMap.commentOutline,
  donate: <DonateIcon />,
  contact: iconMap.contact,
  'copy-link': iconMap.copyLink,
  check: <MdCheck />,
  'chevron-down': iconMap.chevronDown,
  'chevron-left': iconMap.chevronLeft,
  'chevron-right': iconMap.chevronRight,
  'chevron-up': iconMap.chevronUp,
  close: iconMap.close,
  'close-modal': iconMap.crossCloseModal,
  declined: iconMap.declined,
  delete: iconMap.delete,
  difficulty: <FaSignal />,
  discussion: iconMap.discussion,
  doubleTick: iconMap.doubleTick,
  download: <MdFileDownload />,
  'download-cloud': <DownloadIcon />,
  'double-arrow-left': iconMap.doubleArrowLeft,
  'double-arrow-right': iconMap.doubleArrowRight,
  edit: iconMap.edit,
  email: iconMap.email,
  employee: iconMap.employee,
  'email-outline': iconMap.emailOutline,
  'external-url': <ExternalUrl />,
  filter: <FaFilter />,
  'flag-unknown': iconMap.flagUnknown,
  globe: iconMap.globe,
  'gps-location': iconMap.gpsLocation,
  hide: iconMap.hide,
  hyperlink: iconMap.hyperlink,
  information: iconMap.information,
  image: <MdImage />,
  impact: iconMap.impact,
  library: iconMap.library,
  loading: iconMap.loading,
  'location-on': <MdLocationOn />,
  lock: <MdLock />,
  'mail-outline': <MdMailOutline />,
  map: iconMap.map,
  megaphone: iconMap.megaphone,
  'megaphone-active': iconMap.megaphoneActive,
  'megaphone-inactive': iconMap.megaphoneInactive,
  menu: <MdMenu />,
  'more-vert': <MdMoreVert />,
  news: iconMap.news,
  notifications: <MdNotifications />,
  pdf: <FaFilePdf />,
  profile: iconMap.profile,
  reply: iconMap.reply,
  'reply-outline': iconMap.replyOutline,
  report: iconMap.report,
  research: iconMap.research,
  revenue: iconMap.revenue,
  search: iconMap.search,
  'service-email': iconMap.serviceEmail,
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
  upload: <FaCloudUploadAlt />,
  useful: iconMap.useful,
  verified: iconMap.verified,
  volunteer: iconMap.volunteer,
  website: iconMap.website,
  paginationSingleLeft: iconMap.paginationSingleLeft,
  paginationSingleRight: iconMap.paginationSingleRight,
  success: iconMap.success,
  error: iconMap.error,
  warning: iconMap.warning,
  info: iconMap.info,
};

export type IconProps = IProps & VerticalAlignProps & SpaceProps;

const IconWrapper = styled.div<IconProps>`
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
`;

const sizeMap = {
  xs: 8,
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
};

export const getGlyph = (glyph: string) => {
  return glyph in glyphs ? glyphs[glyph as keyof IGlyphs] : null;
};

export const Icon = (props: IconProps) => {
  const { glyph, size, sx } = props;

  if (!getGlyph(glyph)) {
    return null;
  }

  const isSizeNumeric = !isNaN(size as any);

  let definedSize = 16;
  if (isSizeNumeric) {
    definedSize = size as number;
  } else if (Object.keys(sizeMap).includes(size as string)) {
    const pointer = size as 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    definedSize = sizeMap[pointer];
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
        filter: props.filter ?? 'unset',
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
  );
};
