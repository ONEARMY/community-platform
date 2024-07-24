import accountSVG from '../../assets/icons/account.svg'
import arrowCurvedBottomRightSVG from '../../assets/icons/arrow-curved-bottom-right.svg'
import chevronLeftSVG from '../../assets/icons/chevron-left.svg'
import chevronRightSVG from '../../assets/icons/chevron-right.svg'
import employeeSVG from '../../assets/icons/employee.svg'
import eyeSVG from '../../assets/icons/eye.svg'
import eyeCrossedSVG from '../../assets/icons/eye-crossed.svg'
import flagUnknownSVG from '../../assets/icons/flag-unknown.svg'
import hyperlinkSVG from '../../assets/icons/hyperlink.svg'
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
import impactSVG from '../../assets/icons/impact.svg'
import machineSVG from '../../assets/icons/machine.svg'
import mapSVG from '../../assets/icons/map.svg'
import patreonSVG from '../../assets/icons/patreon.svg'
import plasticSVG from '../../assets/icons/plastic.svg'
import profileSVG from '../../assets/icons/profile.svg'
import revenueSVG from '../../assets/icons/revenue.svg'
import supporterSVG from '../../assets/icons/supporter.svg'
import thunderboltSVG from '../../assets/icons/thunderbolt.svg'
import thunderboltGreySVG from '../../assets/icons/thunderbolt-grey.svg'
import volunteerSVG from '../../assets/icons/volunteer.svg'
import loadingSVG from '../../assets/images/loading.svg'

const imgStyle = {
  maxWidth: '100%',
}
interface IProps {
  src: string
}

const ImageIcon = (props: IProps) => {
  return <img alt="icon" style={imgStyle} {...props} />
}

export const iconMap = {
  arrowCurvedBottomRight: <ImageIcon src={arrowCurvedBottomRightSVG} />,
  arrowFullDown: <ImageIcon src={arrowFullDownSVG} />,
  arrowFullUp: <ImageIcon src={arrowFullUpSVG} />,
  account: <ImageIcon src={accountSVG} />,
  bazar: <ImageIcon src={bazarSVG} />,
  chevronLeft: <ImageIcon src={chevronLeftSVG} />,
  chevronRight: <ImageIcon src={chevronRightSVG} />,
  comment: <ImageIcon src={commentSVG} />,
  discord: <ImageIcon src={discordSVG} />,
  emailOutline: <ImageIcon src={emailOutlineSVG} />,
  employee: <ImageIcon src={employeeSVG} />,
  flagUnknown: <ImageIcon src={flagUnknownSVG} />,
  hide: <ImageIcon src={eyeCrossedSVG} />,
  hyperlink: <ImageIcon src={hyperlinkSVG} />,
  impact: <ImageIcon src={impactSVG} />,
  loading: <ImageIcon src={loadingSVG} data-cy="icon-loading" />,
  machine: <ImageIcon src={machineSVG} />,
  map: <ImageIcon src={mapSVG} />,
  patreon: <ImageIcon src={patreonSVG} />,
  plastic: <ImageIcon src={plasticSVG} />,
  profile: <ImageIcon src={profileSVG} />,
  revenue: <ImageIcon src={revenueSVG} />,
  show: <ImageIcon src={eyeSVG} />,
  socialMedia: <ImageIcon src={socialMediaSVG} />,
  star: <ImageIcon src={starSVG} />,
  starActive: <ImageIcon src={starActiveSVG} />,
  supporter: <ImageIcon src={supporterSVG} />,
  thunderbolt: <ImageIcon src={thunderboltSVG} />,
  thunderboltGrey: <ImageIcon src={thunderboltGreySVG} />,
  update: <ImageIcon src={updateSVG} />,
  useful: <ImageIcon src={usefulSVG} />,
  verified: <ImageIcon src={verifiedSVG} />,
  view: <ImageIcon src={viewSVG} />,
  volunteer: <ImageIcon src={volunteerSVG} />,
  website: <ImageIcon src={websiteSVG} />,
}
