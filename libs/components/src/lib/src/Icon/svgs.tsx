import arrowCurvedBottomRightSVG from '../../assets/icons/arrow-curved-bottom-right.svg'
import chevronLeftSVG from '../../assets/icons/chevron-left.svg'
import chevronRightSVG from '../../assets/icons/chevron-right.svg'
import employeeSVG from '../../assets/icons/employee.svg'
import eyeSVG from '../../assets/icons/eye.svg'
import eyeCrossedSVG from '../../assets/icons/eye-crossed.svg'
import flagUnknownSVG from '../../assets/icons/flag-unknown.svg'
import arrowFullDownSVG from '../../assets/icons/icon-arrow-down.svg'
import arrowFullUpSVG from '../../assets/icons/icon-arrow-up.svg'
import bazarSVG from '../../assets/icons/icon-bazar.svg'
import commentSVG from '../../assets/icons/icon-comment.svg'
import discordSVG from '../../assets/icons/icon-discord.svg'
import emailOutlineSVG from '../../assets/icons/icon-email.svg'
import socialMediaSVG from '../../assets/icons/icon-social-media.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'
import starSVG from '../../assets/icons/icon-star-default.svg'
import updateSVG from '../../assets/icons/icon-update.svg'
import usefulSVG from '../../assets/icons/icon-useful.svg'
import verifiedSVG from '../../assets/icons/icon-verified-badge.svg'
import viewSVG from '../../assets/icons/icon-views.svg'
import websiteSVG from '../../assets/icons/icon-website.svg'
import machineSVG from '../../assets/icons/machine.svg'
import plasticSVG from '../../assets/icons/plastic.svg'
import revenueSVG from '../../assets/icons/revenue.svg'
import supporterSVG from '../../assets/icons/supporter.svg'
import volunteerSVG from '../../assets/icons/volunteer.svg'
import loadingSVG from '../../assets/images/loading.svg'

const imgStyle = {
  maxWidth: '100%',
}

export const iconMap = {
  arrowCurvedBottomRight: (
    <img alt="icon" style={imgStyle} src={arrowCurvedBottomRightSVG} />
  ),
  arrowFullDown: <img alt="icon" style={imgStyle} src={arrowFullDownSVG} />,
  arrowFullUp: <img alt="icon" style={imgStyle} src={arrowFullUpSVG} />,
  bazar: <img alt="icon" style={imgStyle} src={bazarSVG} />,
  chevronLeft: <img alt="icon" style={imgStyle} src={chevronLeftSVG} />,
  chevronRight: <img alt="icon" style={imgStyle} src={chevronRightSVG} />,
  comment: <img alt="icon" style={imgStyle} src={commentSVG} />,
  discord: <img alt="icon" style={imgStyle} src={discordSVG} />,
  emailOutline: <img alt="icon" style={imgStyle} src={emailOutlineSVG} />,
  employee: <img alt="icon" style={imgStyle} src={employeeSVG} />,
  flagUnknown: <img alt="alt" style={imgStyle} src={flagUnknownSVG} />,
  hide: <img alt="icon" style={imgStyle} src={eyeCrossedSVG} />,
  loading: (
    <img alt="icon" data-cy="icon-loading" style={imgStyle} src={loadingSVG} />
  ),
  machine: <img alt="icon" style={imgStyle} src={machineSVG} />,
  plastic: <img alt="icon" style={imgStyle} src={plasticSVG} />,
  revenue: <img alt="icon" style={imgStyle} src={revenueSVG} />,
  show: <img alt="icon" style={imgStyle} src={eyeSVG} />,
  socialMedia: <img alt="icon" style={imgStyle} src={socialMediaSVG} />,
  star: <img alt="icon" style={imgStyle} src={starSVG} />,
  starActive: <img alt="icon" style={imgStyle} src={starActiveSVG} />,
  supporter: <img alt="icon" style={imgStyle} src={supporterSVG} />,
  update: <img alt="icon" style={imgStyle} src={updateSVG} />,
  useful: <img alt="icon" style={imgStyle} src={usefulSVG} />,
  verified: <img alt="icon" style={imgStyle} src={verifiedSVG} />,
  view: <img alt="icon" style={imgStyle} src={viewSVG} />,
  volunteer: <img alt="icon" style={imgStyle} src={volunteerSVG} />,
  website: <img alt="icon" style={imgStyle} src={websiteSVG} />,
}
