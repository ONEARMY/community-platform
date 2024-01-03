import bazarSVG from '../../assets/icons/icon-bazar.svg'
import chevronLeftSVG from '../../assets/icons/chevron-left.svg'
import chevronRightSVG from '../../assets/icons/chevron-right.svg'
import commentSVG from '../../assets/icons/icon-comment.svg'
import discordSVG from '../../assets/icons/icon-discord.svg'
import emailOutlineSVG from '../../assets/icons/icon-email.svg'
import eyeSVG from '../../assets/icons/eye.svg'
import eyeCrossedSVG from '../../assets/icons/eye-crossed.svg'
import flagUnknownSVG from '../../assets/icons/flag-unknown.svg'
import loadingSVG from '../../assets/images/loading.svg'
import socialMediaSVG from '../../assets/icons/icon-social-media.svg'
import starSVG from '../../assets/icons/icon-star-default.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'
import supporterSVG from '../../assets/icons/supporter.svg'
import updateSVG from '../../assets/icons/icon-update.svg'
import usefulSVG from '../../assets/icons/icon-useful.svg'
import verifiedSVG from '../../assets/icons/icon-verified-badge.svg'
import viewSVG from '../../assets/icons/icon-views.svg'
import websiteSVG from '../../assets/icons/icon-website.svg'

const imgStyle = {
  maxWidth: '100%',
}

export const iconMap = {
  bazar: <img alt="icon" style={imgStyle} src={bazarSVG} />,
  chevronLeft: <img alt="icon" style={imgStyle} src={chevronLeftSVG} />,
  chevronRight: <img alt="icon" style={imgStyle} src={chevronRightSVG} />,
  comment: <img alt="icon" style={imgStyle} src={commentSVG} />,
  discord: <img alt="icon" style={imgStyle} src={discordSVG} />,
  emailOutline: <img alt="icon" style={imgStyle} src={emailOutlineSVG} />,
  flagUnknown: <img alt="alt" style={imgStyle} src={flagUnknownSVG} />,
  hide: <img alt="icon" style={imgStyle} src={eyeCrossedSVG} />,
  loading: <img alt="icon" style={imgStyle} src={loadingSVG} />,
  show: <img alt="icon" style={imgStyle} src={eyeSVG} />,
  socialMedia: <img alt="icon" style={imgStyle} src={socialMediaSVG} />,
  star: <img alt="icon" style={imgStyle} src={starSVG} />,
  starActive: <img alt="icon" style={imgStyle} src={starActiveSVG} />,
  supporter: <img alt="icon" style={imgStyle} src={supporterSVG} />,
  update: <img alt="icon" style={imgStyle} src={updateSVG} />,
  useful: <img alt="icon" style={imgStyle} src={usefulSVG} />,
  verified: <img alt="icon" style={imgStyle} src={verifiedSVG} />,
  view: <img alt="icon" style={imgStyle} src={viewSVG} />,
  website: <img alt="icon" style={imgStyle} src={websiteSVG} />,
}
