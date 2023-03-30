import loadingSVG from '../../assets/images/loading.svg'
import flagUnknownSVG from '../../assets/icons/flag-unknown.svg'
import starSVG from '../../assets/icons/icon-star-default.svg'
import starActiveSVG from '../../assets/icons/icon-star-active.svg'
import verifiedSVG from '../../assets/icons/icon-verified-badge.svg'
import usefulSVG from '../../assets/icons/icon-useful.svg'
import commentSVG from '../../assets/icons/icon-comment.svg'
import viewSVG from '../../assets/icons/icon-views.svg'
import supporterSVG from '../../assets/icons/supporter.svg'
import socialMediaSVG from '../../assets/icons/icon-social-media.svg'
import discordSVG from '../../assets/icons/icon-discord.svg'
import websiteSVG from '../../assets/icons/icon-website.svg'
import bazarSVG from '../../assets/icons/icon-bazar.svg'
import emailOutlineSVG from '../../assets/icons/icon-email.svg'

const imgStyle = {
  maxWidth: '100%',
}

export const iconMap = {
  flagUnknown: <img alt="alt" style={imgStyle} src={flagUnknownSVG} />,
  loading: <img alt="icon" style={imgStyle} src={loadingSVG} />,
  star: <img alt="icon" style={imgStyle} src={starSVG} />,
  starActive: <img alt="icon" style={imgStyle} src={starActiveSVG} />,
  verified: <img alt="icon" style={imgStyle} src={verifiedSVG} />,
  useful: <img alt="icon" style={imgStyle} src={usefulSVG} />,
  comment: <img alt="icon" style={imgStyle} src={commentSVG} />,
  view: <img alt="icon" style={imgStyle} src={viewSVG} />,
  supporter: <img alt="icon" style={imgStyle} src={supporterSVG} />,
  socialMedia: <img alt="icon" style={imgStyle} src={socialMediaSVG} />,
  discord: <img alt="icon" style={imgStyle} src={discordSVG} />,
  website: <img alt="icon" style={imgStyle} src={websiteSVG} />,
  bazar: <img alt="icon" style={imgStyle} src={bazarSVG} />,
  emailOutline: <img alt="icon" style={imgStyle} src={emailOutlineSVG} />,
}
